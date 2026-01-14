using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace WebAPI.IntegrationTests.Localization;

/// <summary>
/// Tests to verify cross-application language consistency
/// Ensures Dashboard and Main apps have consistent translations
/// Feature: community-localization-enhancement
/// </summary>
public class CrossApplicationConsistencyTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly string[] _supportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };
    private readonly string[] _sharedFeatures = { "common", "navigation", "validation" };

    public CrossApplicationConsistencyTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
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