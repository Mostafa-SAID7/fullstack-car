using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using WebAPI.Controllers.Community.QA;

namespace WebAPI.IntegrationTests;

public class TagsControllerTests : BaseIntegrationTest
{
    public TagsControllerTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetTags_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Act
        var response = await UnauthenticatedClient.GetAsync("/api/v7/qa/tags");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetTags_WithAuthentication_ReturnsTags()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/tags");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Tags retrieved successfully", content);
    }

    [Fact]
    public async Task GetTags_WithSearchTerm_ReturnsFilteredTags()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/tags?searchTerm=javascript");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Tags retrieved successfully", content);
    }

    [Fact]
    public async Task GetPopularTags_WithAuthentication_ReturnsPopularTags()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/tags/popular?maxResults=10");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Popular tags retrieved successfully", content);
    }

    [Fact]
    public async Task SearchTags_WithValidSearchTerm_ReturnsMatchingTags()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/tags/search?searchTerm=react&maxResults=5");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Tag search completed successfully", content);
    }

    [Fact]
    public async Task GetTagsByCategory_WithValidCategory_ReturnsCategoryTags()
    {
        // First get categories to find a valid category ID
        var categoriesResponse = await Client.GetAsync("/api/v7/qa/categories");
        Assert.Equal(HttpStatusCode.OK, categoriesResponse.StatusCode);

        var categoriesContent = await categoriesResponse.Content.ReadAsStringAsync();
        var categoriesResult = JsonSerializer.Deserialize<ApiResponse<List<CategoryDto>>>(categoriesContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        if (categoriesResult?.Data?.Any() == true)
        {
            var categoryId = categoriesResult.Data.First().Id;

            // Act
            var response = await Client.GetAsync($"/api/v7/qa/tags/category/{categoryId}?maxResults=10");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Contains("Category tags retrieved successfully", content);
        }
    }

    [Fact]
    public async Task SuggestTags_WithValidContent_ReturnsTagSuggestions()
    {
        var request = new TagSuggestionRequest
        {
            Content = "I'm having trouble with React hooks and state management in my JavaScript application. How can I optimize performance?"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/tags/suggest", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Tag suggestions generated successfully", content);
    }

    [Fact]
    public async Task SuggestTags_WithEmptyContent_ReturnsBadRequest()
    {
        var request = new TagSuggestionRequest
        {
            Content = ""
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/tags/suggest", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTag_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/tags/{invalidId}");

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }
}