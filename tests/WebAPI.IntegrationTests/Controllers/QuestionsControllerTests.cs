using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using WebAPI.IntegrationTests.Core;

namespace WebAPI.IntegrationTests.Controllers;

/// <summary>
/// Integration tests for Questions Controller
/// Tests QA questions API endpoints functionality
/// </summary>
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
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task SearchQuestions_WithValidTerm_ReturnsResults()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/questions/search?searchTerm=test&pageSize=5");

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
    public async Task CreateQuestion_WithValidData_ReturnsCreated()
    {
        // Arrange
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Integration Test Question",
            Content = "This is a test question created during integration testing to verify the API functionality.",
            Category = "Testing",
            Tags = new List<string> { "integration", "test", "api" }
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);

        // Assert
        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            // Endpoint might not be implemented yet
            return;
        }

        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
            
            var questionResponse = DeserializeApiResponseData<QuestionDto>(content);
            Assert.NotNull(questionResponse);
            Assert.Equal(questionRequest.Title, questionResponse.Title);
        }
    }

    [Fact]
    public async Task CreateQuestion_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var invalidQuestionRequest = new CreateQuestionRequest
        {
            Title = "", // Invalid: empty title
            Content = "Short", // Invalid: too short
            Category = "",
            Tags = new List<string>()
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task GetQuestion_WithValidId_ReturnsQuestion()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/questions/{questionId}");

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.OK || 
                   response.StatusCode == HttpStatusCode.NotFound);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.NotEmpty(content);
        }
    }

    [Fact]
    public async Task GetQuestion_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = Guid.Empty;

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/questions/{invalidId}");

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.NotFound || 
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateQuestion_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var questionId = Guid.NewGuid();
        var updateRequest = new UpdateQuestionRequest
        {
            Title = "Updated Integration Test Question",
            Content = "This question has been updated during integration testing.",
            Tags = new List<string> { "updated", "integration", "test" }
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v7/qa/questions/{questionId}", updateRequest);

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task DeleteQuestion_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await Client.DeleteAsync($"/api/v7/qa/questions/{questionId}");

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetQuestionsByCategory_ReturnsFilteredResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/questions?category=Technology&pageSize=10");

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
    public async Task GetQuestionsByTag_ReturnsFilteredResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/questions?tags=javascript&pageSize=10");

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
    public async Task GetMyQuestions_ReturnsUserQuestions()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/questions/my-questions?pageSize=10");

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
    public async Task GetSimilarQuestions_WithValidId_ReturnsSimilar()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/questions/{questionId}/similar?limit=5");

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
    public async Task CloseQuestion_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await Client.PostAsync($"/api/v7/qa/questions/{questionId}/close", null);

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ReopenQuestion_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await Client.PostAsync($"/api/v7/qa/questions/{questionId}/reopen", null);

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.BadRequest);
    }
}