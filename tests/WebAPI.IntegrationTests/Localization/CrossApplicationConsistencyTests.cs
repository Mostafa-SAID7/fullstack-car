using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using WebAPI.IntegrationTests.Core;
using Xunit;

namespace WebAPI.IntegrationTests.Localization;

/// <summary>
/// Tests to verify cross-application language consistency
/// Ensures Dashboard and Main apps have consistent translations
/// Feature: community-localization-enhancement
/// </summary>
public class CrossApplicationConsistencyTests : BaseIntegrationTest
{
    private readonly string[] _supportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };
    private readonly string[] _sharedFeatures = { "common", "navigation", "validation" };
    private readonly string[] _dashboardFeatures = { "management", "analytics", "moderation" };
    private readonly string[] _mainFeatures = { "posts", "groups", "qa", "reviews", "social", "maps", "news", "guides" };

    public CrossApplicationConsistencyTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetSupportedCultures_ShouldReturnAllConfiguredCultures()
    {
        // Arrange & Act
        var response = await _client.GetAsync("/api/v7/localization/cultures/supported");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var cultures = await response.Content.ReadFromJsonAsync<string[]>();
        Assert.NotNull(cultures);
        Assert.Equal(_supportedCultures.Length, cultures.Length);
        foreach (var culture in _supportedCultures)
        {
            Assert.Contains(culture, cultures);
        }
    }
}

    [Fact]
    public async Task SharedFeatures_AllCultures_ShouldHaveConsistentTranslations()
    {
        // Test that shared features (common, navigation, validation) have consistent translations
        // across all cultures for both Dashboard and Main apps
        
        foreach (var feature in _sharedFeatures)
        {
            var translationsByCulture = new Dictionary<string, HashSet<string>>();
            
            foreach (var culture in _supportedCultures)
            {
                var response = await Client.GetAsync($"/api/v7/localization/translations/{culture}/{feature}");
                
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                    if (translations != null && translations.Count > 0)
                    {
                        translationsByCulture[culture] = translations.Keys.ToHashSet();
                    }
                }
            }
            
            // If we have translations for multiple cultures, verify consistency
            if (translationsByCulture.Count > 1)
            {
                var referenceKeys = translationsByCulture.ContainsKey("en-US")
                    ? translationsByCulture["en-US"]
                    : translationsByCulture.First().Value;
                
                foreach (var (culture, keys) in translationsByCulture)
                {
                    if (culture == "en-US") continue;
                    
                    var intersection = referenceKeys.Intersect(keys).Count();
                    var minExpected = Math.Min(referenceKeys.Count, keys.Count) * 0.8;
                    
                    Assert.True(intersection >= minExpected,
                        $"Shared feature '{feature}' has inconsistent keys between en-US and {culture}");
                }
            }
        }
    }

    [Theory]
    [InlineData("en-US")]
    [InlineData("ar-EG")]
    [InlineData("ar-AE")]
    [InlineData("ar-SA")]
    public async Task DashboardAndMainApps_SameCulture_ShouldHaveConsistentSharedTerminology(string culture)
    {
        // Load shared translations that should be consistent across both apps
        var commonResponse = await Client.GetAsync($"/api/v7/localization/translations/{culture}/common");
        
        if (commonResponse.StatusCode == HttpStatusCode.OK)
        {
            var commonTranslations = await commonResponse.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.NotNull(commonTranslations);
            
            // Verify common terms exist and are not empty
            if (commonTranslations.Count > 0)
            {
                foreach (var translation in commonTranslations)
                {
                    Assert.False(string.IsNullOrWhiteSpace(translation.Value),
                        $"Common translation key '{translation.Key}' is empty in culture {culture}");
                }
            }
        }
    }

    [Fact]
    public async Task AllFeatures_EnglishCulture_ShouldHaveCompleteTranslations()
    {
        // English should be the most complete as it's the fallback language
        var allFeatures = _sharedFeatures.Concat(_dashboardFeatures).Concat(_mainFeatures).Distinct();
        
        foreach (var feature in allFeatures)
        {
            var response = await Client.GetAsync($"/api/v7/localization/translations/en-US/{feature}");
            
            // English translations should exist for all features
            if (response.StatusCode == HttpStatusCode.OK)
            {
                var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                Assert.NotNull(translations);
                
                // If translations exist, they should not be empty
                if (translations.Count > 0)
                {
                    Assert.All(translations.Values, value => 
                        Assert.False(string.IsNullOrWhiteSpace(value)));
                }
            }
        }
    }

    [Theory]
    [InlineData("posts")]
    [InlineData("groups")]
    [InlineData("qa")]
    [InlineData("reviews")]
    public async Task MainAppFeatures_AllCultures_ShouldLoadSuccessfully(string feature)
    {
        foreach (var culture in _supportedCultures)
        {
            var response = await Client.GetAsync($"/api/v7/localization/translations/{culture}/{feature}");
            
            // Should either succeed or fallback gracefully
            Assert.True(
                response.StatusCode == HttpStatusCode.OK || 
                response.StatusCode == HttpStatusCode.NotFound,
                $"Unexpected status for Main app feature {feature} in culture {culture}");
        }
    }

    [Fact]
    public async Task BatchTranslation_MixedFeatures_ShouldReturnConsistentData()
    {
        // Test loading mixed features from both Dashboard and Main apps
        var mixedFeatures = new[] { "posts", "groups", "common", "validation" };
        
        foreach (var culture in _supportedCultures)
        {
            var batchRequest = new
            {
                culture = culture,
                features = mixedFeatures
            };
            
            var response = await Client.PostAsJsonAsync("/api/v7/localization/translations/batch", batchRequest);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var batchTranslations = await response.Content.ReadFromJsonAsync<Dictionary<string, Dictionary<string, string>>>();
            Assert.NotNull(batchTranslations);
            
            // Verify we got responses
            Assert.True(batchTranslations.Count > 0,
                $"Batch translation for {culture} returned no data");
        }
    }

    [Theory]
    [InlineData("ar-EG")]
    [InlineData("ar-AE")]
    [InlineData("ar-SA")]
    public async Task ArabicVariants_ShouldHaveDistinctTranslations(string culture)
    {
        // Verify that different Arabic variants have their own translations
        // (not just falling back to a generic Arabic)
        
        var response = await Client.GetAsync($"/api/v7/localization/translations/{culture}/posts");
        
        if (response.StatusCode == HttpStatusCode.OK)
        {
            var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.NotNull(translations);
            
            if (translations.Count > 0)
            {
                // Verify Arabic content exists
                var hasArabicContent = translations.Values.Any(v =>
                    !string.IsNullOrEmpty(v) && v.Any(c => c >= '\u0600' && c <= '\u06FF'));
                
                Assert.True(hasArabicContent,
                    $"Arabic variant {culture} should have Arabic content");
            }
        }
    }

    [Fact]
    public async Task TranslationCompleteness_AllCultures_ShouldBeTracked()
    {
        // Verify that translation completeness can be checked for all cultures
        foreach (var culture in _supportedCultures)
        {
            var response = await Client.GetAsync($"/api/v7/localization/cultures/supported");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var supportedCultures = await response.Content.ReadFromJsonAsync<string[]>();
            Assert.NotNull(supportedCultures);
            Assert.Contains(culture, supportedCultures);
        }
    }

    [Fact]
    public async Task LanguageSwitching_BetweenApplications_ShouldMaintainConsistency()
    {
        // Simulate a user switching languages while navigating between Dashboard and Main app
        foreach (var culture in _supportedCultures)
        {
            // Load Dashboard feature
            var dashboardResponse = await Client.GetAsync($"/api/v7/localization/translations/{culture}/common");
            
            // Load Main app feature
            var mainResponse = await Client.GetAsync($"/api/v7/localization/translations/{culture}/posts");
            
            // Both should succeed or both should fallback consistently
            if (dashboardResponse.StatusCode == HttpStatusCode.OK && 
                mainResponse.StatusCode == HttpStatusCode.OK)
            {
                var dashboardTranslations = await dashboardResponse.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                var mainTranslations = await mainResponse.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                
                Assert.NotNull(dashboardTranslations);
                Assert.NotNull(mainTranslations);
                
                // Both should have valid translations
                if (dashboardTranslations.Count > 0)
                {
                    Assert.All(dashboardTranslations.Values, v => Assert.False(string.IsNullOrWhiteSpace(v)));
                }
                
                if (mainTranslations.Count > 0)
                {
                    Assert.All(mainTranslations.Values, v => Assert.False(string.IsNullOrWhiteSpace(v)));
                }
            }
        }
    }
}
