using Application.Features.Media.Discovery.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;

namespace WebAPI.IntegrationTests;

public class DiscoveryApiTests : BaseIntegrationTest
{
    public DiscoveryApiTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task Search_WithValidQuery_ReturnsResults()
    {
        // Arrange
        var searchQuery = "test";

        // Act
        var response = await Client.GetAsync($"/api/v7.0/media/discovery/search?searchTerm={searchQuery}&pageSize=10");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task GetTrending_WithDefaultParameters_ReturnsResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7.0/media/discovery/trending");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task GetFeatured_WithDefaultParameters_ReturnsResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7.0/media/discovery/featured");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task GetCategories_ReturnsResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7.0/media/discovery/categories");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task BrowseByCategory_WithValidCategory_ReturnsResults()
    {
        // Arrange
        var category = "technology";

        // Act
        var response = await Client.GetAsync($"/api/v7.0/media/discovery/categories/{category}");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task GetSearchSuggestions_WithValidQuery_ReturnsResults()
    {
        // Arrange
        var query = "tech";

        // Act
        var response = await Client.GetAsync($"/api/v7.0/media/discovery/suggestions?query={query}");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task GetRecommendations_WithoutAuth_ReturnsGenericResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7.0/media/discovery/recommendations");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Theory]
    [InlineData("video")]
    [InlineData("podcast")]
    public async Task Search_WithMediaTypeFilter_ReturnsFilteredResults(string mediaType)
    {
        // Act
        var response = await Client.GetAsync($"/api/v7.0/media/discovery/search?mediaType={mediaType}");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }

    [Theory]
    [InlineData("ViewsOnly")]
    [InlineData("ViewsAndEngagement")]
    [InlineData("EngagementRate")]
    [InlineData("RecentPopularity")]
    public async Task GetTrending_WithDifferentAlgorithms_ReturnsResults(string algorithm)
    {
        // Act
        var response = await Client.GetAsync($"/api/v7.0/media/discovery/trending?algorithm={algorithm}");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        
        var jsonDoc = JsonDocument.Parse(content);
        Assert.True(jsonDoc.RootElement.GetProperty("success").GetBoolean());
    }
}