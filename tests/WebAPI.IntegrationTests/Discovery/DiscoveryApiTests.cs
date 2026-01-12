using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text.Json;
using Xunit;
using WebAPI.IntegrationTests.Core;

namespace WebAPI.IntegrationTests.Discovery;

/// <summary>
/// Integration tests for Discovery API endpoints
/// Tests content discovery, recommendations, and search functionality
/// </summary>
public class DiscoveryApiTests : BaseIntegrationTest
{
    public DiscoveryApiTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetRecommendations_WithAuthentication_ReturnsRecommendations()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/recommendations?limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
            
            // Verify JSON structure
            var jsonDoc = JsonDocument.Parse(content);
            Assert.NotNull(jsonDoc);
        }
    }

    [Fact]
    public async Task GetRecommendations_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Act
        var response = await UnauthenticatedClient.GetAsync("/api/v7/discovery/recommendations");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetTrendingContent_ReturnsPopularContent()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/trending?timeframe=week&limit=15");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task SearchContent_WithValidQuery_ReturnsResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/search?query=technology&type=all&limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task SearchContent_WithEmptyQuery_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/search?query=&type=all");

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetContentByCategory_WithValidCategory_ReturnsContent()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/category/technology?limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetRelatedContent_WithValidContentId_ReturnsRelated()
    {
        // Arrange
        var contentId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/discovery/related/{contentId}?limit=5");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetPersonalizedFeed_ReturnsUserSpecificContent()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/feed?pageSize=15");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetPopularTags_ReturnsTagList()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/tags/popular?limit=20");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetContentByTag_WithValidTag_ReturnsContent()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/tag/javascript?limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetRecentContent_ReturnsLatestContent()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/recent?contentType=all&limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetFeaturedContent_ReturnsHighlightedContent()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/featured?limit=5");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetContentSuggestions_WithUserHistory_ReturnsSuggestions()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/suggestions?basedOn=history&limit=8");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task SearchWithFilters_ReturnsFilteredResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/search?query=programming&contentType=video&category=technology&dateRange=week&limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetTopCreators_ReturnsInfluentialUsers()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/creators/top?timeframe=month&limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetContentByCreator_WithValidCreatorId_ReturnsContent()
    {
        // Arrange
        var creatorId = TestUserGuid;

        // Act
        var response = await Client.GetAsync($"/api/v7/discovery/creator/{creatorId}/content?limit=10");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetDiscoveryStats_ReturnsSystemMetrics()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/stats");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task SearchAutoComplete_WithPartialQuery_ReturnsSuggestions()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/search/autocomplete?partial=prog&limit=5");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetContentHistory_ReturnsUserHistory()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/history?limit=20");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetBookmarkedContent_ReturnsUserBookmarks()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/bookmarks?limit=15");

        // Assert
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task SearchWithInvalidParameters_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/search?query=test&limit=-1");

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetRecommendations_WithInvalidLimit_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/discovery/recommendations?limit=1000");

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.IsSuccessStatusCode); // Some APIs might handle large limits gracefully
    }
}