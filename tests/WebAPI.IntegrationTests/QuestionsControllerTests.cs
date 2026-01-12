using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace WebAPI.IntegrationTests;

public class QuestionsControllerTests : BaseIntegrationTest
{
    public QuestionsControllerTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetQuestions_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Act
        var response = await UnauthenticatedClient.GetAsync("/api/v7/qa/questions");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetQuestions_WithAuthentication_ReturnsQuestions()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/questions");

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
        var request = new CreateQuestionRequest
        {
            Title = "Test Question for Integration Test",
            Content = "This is a test question content that meets the minimum length requirements for the QA system.",
            Category = "Technology",
            Tags = new List<string> { "test", "integration" }
        };

        // Act - No need to set authorization header as test auth is configured
        var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);

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
        var request = new CreateQuestionRequest
        {
            Title = "Short", // Too short
            Content = "Short", // Too short
            Category = "Technology",
            Tags = new List<string> { "test" }
        };

        // Act - No need to set authorization header as test auth is configured
        var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task SearchQuestions_WithSearchTerm_ReturnsResults()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/questions/search?searchTerm=test&pageSize=5");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Search completed successfully", content);
    }
}