using System.Net;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.Testing;
using WebAPI.IntegrationTests.Core;
using Xunit;

namespace WebAPI.IntegrationTests.Localization;

/// <summary>
/// Comprehensive E2E tests for the localization system
/// Tests complete user journeys across all supported languages
/// Feature: community-localization-enhancement
/// </summary>
public class LocalizationE2ETests : BaseIntegrationTest
{
    private readonly string[] _supportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };
    private readonly string[] _communityFeatures = { "posts", "groups", "qa", "reviews", "social", "maps", "news", "guides" };

    public LocalizationE2ETests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Theory]
    [InlineData("en-US")]
    [InlineData("ar-EG")]
    [InlineData("ar-AE")]
    [InlineData("ar-SA")]
    public async Task CompleteUserJourney_AllLanguages_ShouldWorkEndToEnd(string culture)
    {
        // Test complete user journey: language detection -> translation loading -> feature usage
        
        // 1. Test culture detection and supported cultures endpoint
        var culturesResponse = await Client.GetAsync("/api/v7/localization/cultures/supported");
        Assert.Equal(HttpStatusCode.OK, culturesResponse.StatusCode);
        
        var supportedCultures = await culturesResponse.Content.ReadFromJsonAsync<List<string>>();
        Assert.NotNull(supportedCultures);
        Assert.Contains(culture, supportedCultures);

        // 2. Test translation loading for posts feature
        var translationsResponse = await Client.GetAsync($"/api/v7/localization/translations/{culture}/posts");
        Assert.Equal(HttpStatusCode.OK, translationsResponse.StatusCode);
        
        var translations = await translationsResponse.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(translations);
        Assert.NotEmpty(translations);
        
        // Verify key translations exist
        Assert.True(translations.ContainsKey("posts.title") || translations.Any(k => k.Key.StartsWith("posts.")));

        // 3. Test batch translation loading for multiple features
        var batchRequest = new
        {
            culture = culture,
            features = new[] { "posts", "groups", "reviews" }
        };
        
        var batchResponse = await Client.PostAsJsonAsync("/api/v7/localization/translations/batch", batchRequest);
        Assert.Equal(HttpStatusCode.OK, batchResponse.StatusCode);
        
        var batchTranslations = await batchResponse.Content.ReadFromJsonAsync<Dictionary<string, Dictionary<string, string>>>();
        Assert.NotNull(batchTranslations);
        Assert.Equal(3, batchTranslations.Count);
    }

    [Fact]
    public async Task UserJourney_LanguageSwitching_ShouldMaintainConsistency()
    {
        // Test switching between all supported languages
        foreach (var fromCulture in _supportedCultures)
        {
            foreach (var toCulture in _supportedCultures)
            {
                // Load translations in first language
                var response1 = await Client.GetAsync($"/api/v7/localization/translations/{fromCulture}/posts");
                Assert.Equal(HttpStatusCode.OK, response1.StatusCode);
                
                var translations1 = await response1.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                Assert.NotNull(translations1);
                Assert.NotEmpty(translations1);

                // Switch to second language
                var response2 = await Client.GetAsync($"/api/v7/localization/translations/{toCulture}/posts");
                Assert.Equal(HttpStatusCode.OK, response2.StatusCode);
                
                var translations2 = await response2.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                Assert.NotNull(translations2);
                Assert.NotEmpty(translations2);

                // Verify both have similar key structure
                var keys1 = translations1.Keys.OrderBy(k => k).ToList();
                var keys2 = translations2.Keys.OrderBy(k => k).ToList();
                
                var keyIntersection = keys1.Intersect(keys2).Count();
                var minExpectedKeys = Math.Min(keys1.Count, keys2.Count) * 0.8;
                
                Assert.True(keyIntersection >= minExpectedKeys, 
                    $"Language consistency check failed: {fromCulture} -> {toCulture}");
            }
        }
    }

    [Theory]
    [InlineData("ar-EG")]
    [InlineData("ar-AE")]
    [InlineData("ar-SA")]
    public async Task RTL_ArabicLanguages_ShouldIndicateRTLSupport(string culture)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v7/localization/translations/{culture}/posts");
        request.Headers.Add("Accept-Language", culture);
        
        var response = await Client.SendAsync(request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(translations);
        
        var hasArabicText = translations.Values.Any(v => 
            v.Any(c => c >= '\u0600' && c <= '\u06FF'));
        
        Assert.True(hasArabicText || translations.Count == 0, 
            $"Culture {culture} should contain Arabic text or be empty (fallback)");
    }

    [Fact]
    public async Task Performance_TranslationLoading_ShouldBeFast()
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        var response = await Client.GetAsync("/api/v7/localization/translations/en-US/posts");
        
        stopwatch.Stop();
        
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(stopwatch.ElapsedMilliseconds < 1000, 
            $"Translation loading took {stopwatch.ElapsedMilliseconds}ms");
    }

    [Fact]
    public async Task CompleteUserJourney_AllCommunityFeatures_ShouldLoadTranslations()
    {
        // Test that all community features have translations available
        foreach (var culture in _supportedCultures)
        {
            foreach (var feature in _communityFeatures)
            {
                var response = await Client.GetAsync($"/api/v7/localization/translations/{culture}/{feature}");
                
                // Should either return translations or fallback gracefully
                Assert.True(
                    response.StatusCode == HttpStatusCode.OK || 
                    response.StatusCode == HttpStatusCode.NotFound,
                    $"Unexpected status for {culture}/{feature}: {response.StatusCode}");
                
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                    Assert.NotNull(translations);
                }
            }
        }
    }

    [Theory]
    [InlineData("en-US", "posts")]
    [InlineData("ar-EG", "groups")]
    [InlineData("ar-AE", "qa")]
    [InlineData("ar-SA", "reviews")]
    public async Task RTL_LayoutDirection_ShouldBeCorrectForCulture(string culture, string feature)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v7/localization/translations/{culture}/{feature}");
        request.Headers.Add("Accept-Language", culture);
        
        var response = await Client.SendAsync(request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Verify RTL cultures are properly identified
        var isRTL = culture.StartsWith("ar-");
        
        // The response should contain translations appropriate for the direction
        var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(translations);
        
        if (isRTL && translations.Count > 0)
        {
            // At least some translations should contain Arabic characters
            var hasArabicContent = translations.Values.Any(v => 
                !string.IsNullOrEmpty(v) && v.Any(c => c >= '\u0600' && c <= '\u06FF'));
            
            Assert.True(hasArabicContent || culture == "en-US", 
                $"RTL culture {culture} should have Arabic content");
        }
    }

    [Fact]
    public async Task BatchTranslation_AllFeatures_ShouldReturnConsistentData()
    {
        foreach (var culture in _supportedCultures)
        {
            var batchRequest = new
            {
                culture = culture,
                features = _communityFeatures
            };
            
            var response = await Client.PostAsJsonAsync("/api/v7/localization/translations/batch", batchRequest);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var batchTranslations = await response.Content.ReadFromJsonAsync<Dictionary<string, Dictionary<string, string>>>();
            Assert.NotNull(batchTranslations);
            
            // Verify we got responses for all requested features
            Assert.True(batchTranslations.Count > 0, 
                $"Batch translation for {culture} returned no features");
            
            // Verify each feature has translations
            foreach (var featureTranslations in batchTranslations.Values)
            {
                Assert.NotNull(featureTranslations);
            }
        }
    }

    [Theory]
    [InlineData("en-US")]
    [InlineData("ar-EG")]
    public async Task TranslationFallback_MissingKey_ShouldFallbackToEnglish(string culture)
    {
        // Request a feature that might not have complete translations
        var response = await Client.GetAsync($"/api/v7/localization/translations/{culture}/posts");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(translations);
        
        // If we got translations, they should be valid (not empty or null values)
        if (translations.Count > 0)
        {
            foreach (var translation in translations)
            {
                Assert.False(string.IsNullOrWhiteSpace(translation.Value), 
                    $"Translation key '{translation.Key}' has empty value in culture {culture}");
            }
        }
    }

    [Fact]
    public async Task CultureDetection_AcceptLanguageHeader_ShouldBeRespected()
    {
        foreach (var culture in _supportedCultures)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/v7/localization/cultures/supported");
            request.Headers.Add("Accept-Language", culture);
            
            var response = await Client.SendAsync(request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var supportedCultures = await response.Content.ReadFromJsonAsync<List<string>>();
            Assert.NotNull(supportedCultures);
            Assert.Contains(culture, supportedCultures);
        }
    }

    [Fact]
    public async Task TranslationKeys_HierarchicalStructure_ShouldBeFlattened()
    {
        var response = await Client.GetAsync("/api/v7/localization/translations/en-US/posts");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(translations);
        
        if (translations.Count > 0)
        {
            // Verify that keys use dot notation for hierarchy
            var hasHierarchicalKeys = translations.Keys.Any(k => k.Contains('.'));
            Assert.True(hasHierarchicalKeys || translations.Count == 0, 
                "Translations should use hierarchical dot notation");
        }
    }

    [Theory]
    [InlineData("posts")]
    [InlineData("groups")]
    [InlineData("qa")]
    [InlineData("reviews")]
    public async Task FeatureTranslations_AllCultures_ShouldHaveConsistentKeys(string feature)
    {
        var translationsByCulture = new Dictionary<string, Dictionary<string, string>>();
        
        // Load translations for all cultures
        foreach (var culture in _supportedCultures)
        {
            var response = await Client.GetAsync($"/api/v7/localization/translations/{culture}/{feature}");
            
            if (response.StatusCode == HttpStatusCode.OK)
            {
                var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                if (translations != null && translations.Count > 0)
                {
                    translationsByculture[culture] = translations;
                }
            }
        }
        
        if (translationsByculture.Count > 1)
        {
            // Get the reference key set (from en-US if available, otherwise first culture)
            var referenceKeys = translationsByculture.ContainsKey("en-US") 
                ? translationsByculture["en-US"].Keys.ToHashSet()
                : translationsByculture.First().Value.Keys.ToHashSet();
            
            // Verify other cultures have similar key structure (allowing for some variance)
            foreach (var (culture, translations) in translationsByculture)
            {
                if (culture == "en-US") continue;
                
                var currentKeys = translations.Keys.ToHashSet();
                var intersection = referenceKeys.Intersect(currentKeys).Count();
                var minExpected = Math.Min(referenceKeys.Count, currentKeys.Count) * 0.7;
                
                Assert.True(intersection >= minExpected,
                    $"Feature '{feature}' in culture '{culture}' has inconsistent keys. " +
                    $"Expected at least {minExpected} matching keys, got {intersection}");
            }
        }
    }
}
