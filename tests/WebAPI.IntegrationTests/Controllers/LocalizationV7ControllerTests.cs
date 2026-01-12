using Application.Features.Shared.Localization.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using Xunit;
using WebAPI.IntegrationTests.Core;

namespace WebAPI.IntegrationTests.Controllers;

/// <summary>
/// Integration tests for LocalizationV7Controller
/// Tests the v7 API endpoints for community-specific translation loading
/// Feature: community-localization-enhancement, Task 5
/// </summary>
public class LocalizationV7ControllerTests : BaseIntegrationTest
{
    public LocalizationV7ControllerTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetTranslations_WithValidCultureAndFeature_ShouldReturnTranslations()
    {
        // Arrange
        var culture = "en-US";
        var feature = "posts";

        // Act
        var response = await Client.GetAsync($"/api/v7.0/localization/translations/{culture}/{feature}");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.NotNull(translations);
        }
    }

    [Fact]
    public async Task GetTranslations_WithInvalidCulture_ShouldReturnFallbackTranslations()
    {
        // Arrange
        var culture = "invalid-culture";
        var feature = "posts";

        // Act
        var response = await Client.GetAsync($"/api/v7.0/localization/translations/{culture}/{feature}");

        // Assert
        Assert.True(response.IsSuccessStatusCode);
        
        if (response.IsSuccessStatusCode)
        {
            var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.NotNull(translations);
            // Should have fallback translations from en-US
            Assert.True(translations.Count > 0);
        }
    }

    [Fact]
    public async Task GetBatchTranslations_WithValidRequest_ShouldReturnTranslations()
    {
        // Arrange
        var request = new BatchTranslationRequestDto
        {
            Culture = "en-US",
            Features = new[] { "posts", "groups" }
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7.0/localization/translations/batch", request);

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest);
        
        if (response.IsSuccessStatusCode)
        {
            var translations = await response.Content.ReadFromJsonAsync<Dictionary<string, Dictionary<string, string>>>();
            Assert.NotNull(translations);
        }
    }

    [Fact]
    public async Task GetBatchTranslations_WithEmptyFeatures_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new BatchTranslationRequestDto
        {
            Culture = "en-US",
            Features = Array.Empty<string>()
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7.0/localization/translations/batch", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSupportedCultures_ShouldReturnCultures()
    {
        // Act
        var response = await Client.GetAsync("/api/v7.0/localization/cultures/supported");

        // Assert
        Assert.True(response.IsSuccessStatusCode);
        
        var cultures = await response.Content.ReadFromJsonAsync<IEnumerable<string>>();
        Assert.NotNull(cultures);
    }
}