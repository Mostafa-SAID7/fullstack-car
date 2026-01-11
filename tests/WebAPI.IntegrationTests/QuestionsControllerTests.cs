using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace WebAPI.IntegrationTests;

public class QuestionsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public QuestionsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetQuestions_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v7/qa/questions");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetQuestions_WithAuthentication_ReturnsQuestions()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/v7/qa/questions");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Questions retrieved successfully", content);
    }

    [Fact]
    public async Task CreateQuestion_WithValidData_ReturnsCreated()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var request = new CreateQuestionRequest
        {
            Title = "Test Question for Integration Test",
            Content = "This is a test question content that meets the minimum length requirements for the QA system.",
            Category = "Technology",
            Tags = new List<string> { "test", "integration" }
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v7/qa/questions", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Question created successfully", content);
    }

    [Fact]
    public async Task CreateQuestion_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var request = new CreateQuestionRequest
        {
            Title = "Short", // Too short
            Content = "Short", // Too short
            Category = "Technology",
            Tags = new List<string> { "test" }
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v7/qa/questions", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task SearchQuestions_WithSearchTerm_ReturnsResults()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/v7/qa/questions/search?searchTerm=test&pageSize=5");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Search completed successfully", content);
    }

    private async Task<string> GetAuthTokenAsync()
    {
        // This is a simplified auth token retrieval
        // In a real test, you would authenticate with a test user
        // For now, we'll use a mock token or skip auth in test environment
        
        var loginRequest = new
        {
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        try
        {
            var loginResponse = await _client.PostAsJsonAsync("/api/v7/auth/login", loginRequest);
            if (loginResponse.IsSuccessStatusCode)
            {
                var loginContent = await loginResponse.Content.ReadAsStringAsync();
                var loginResult = JsonSerializer.Deserialize<JsonElement>(loginContent);
                
                if (loginResult.TryGetProperty("data", out var data) && 
                    data.TryGetProperty("token", out var tokenElement))
                {
                    return tokenElement.GetString() ?? string.Empty;
                }
            }
        }
        catch
        {
            // If auth fails, return empty token for now
            // In production tests, this should be handled properly
        }

        return string.Empty;
    }
}