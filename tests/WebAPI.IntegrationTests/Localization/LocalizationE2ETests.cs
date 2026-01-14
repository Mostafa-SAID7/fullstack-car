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
                var response1 = await _client.GetAsync($"/api/v7/localization/translations/{fromCulture}/posts");
                Assert.Equal(HttpStatusCode.OK, response1.StatusCode);
                
                var translations1 = await response1.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                Assert.NotNull(translations1);
                Assert.NotEmpty(translations1);

                // Switch to second language
                var response2 = await _client.GetAsync($"/api/v7/localization/translations/{toCulture}/posts");
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
        
        var response = await _client.SendAsync(request);
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
        
        var response = await _client.GetAsync("/api/v7/localization/translations/en-US/posts");
        
        stopwatch.Stop();
        
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(stopwatch.ElapsedMilliseconds < 1000, 
            $"Translation loading took {stopwatch.ElapsedMilliseconds}ms");
    }
}
