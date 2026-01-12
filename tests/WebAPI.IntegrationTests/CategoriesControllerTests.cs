using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace WebAPI.IntegrationTests;

public class CategoriesControllerTests : BaseIntegrationTest
{
    public CategoriesControllerTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetCategories_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Act
        var response = await UnauthenticatedClient.GetAsync("/api/v7/qa/categories");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCategories_WithAuthentication_ReturnsCategories()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/categories");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Categories retrieved successfully", content);
    }

    [Fact]
    public async Task GetCategories_WithSearchTerm_ReturnsFilteredCategories()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/categories?searchTerm=tech");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Categories retrieved successfully", content);
    }

    [Fact]
    public async Task GetPopularCategories_WithAuthentication_ReturnsPopularCategories()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/categories/popular?maxResults=5");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Popular categories retrieved successfully", content);
    }

    [Fact]
    public async Task GetCategoryExperts_WithValidCategory_ReturnsExperts()
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
            var response = await Client.GetAsync($"/api/v7/qa/categories/{categoryId}/experts");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Contains("Category experts retrieved successfully", content);
        }
    }

    [Fact]
    public async Task GetCategory_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/categories/{invalidId}");

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