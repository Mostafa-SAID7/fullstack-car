using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace WebAPI.IntegrationTests;

public class AnswersControllerTests : BaseIntegrationTest
{
    public AnswersControllerTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetAnswersByQuestion_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await UnauthenticatedClient.GetAsync($"/api/v7/qa/answers/question/{questionId}");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAnswersByQuestion_WithAuthentication_ReturnsAnswers()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync($"/api/v7/qa/answers/question/{questionId}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Answers retrieved successfully", content);
    }

    [Fact]
    public async Task CreateAnswer_WithValidData_ReturnsCreated()
    {
        // Arrange
        // First create a question to answer
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Test Question for Answer Integration Test",
            Content = "This is a test question content that meets the minimum length requirements for the QA system.",
            Category = "Technology",
            Tags = new List<string> { "test", "integration" }
        };

        var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        Assert.Equal(HttpStatusCode.Created, questionResponse.StatusCode);

        var questionContent = await questionResponse.Content.ReadAsStringAsync();
        var questionResult = JsonSerializer.Deserialize<QuestionDto>(questionContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = questionResult!.Id,
            Content = "This is a comprehensive answer to the test question with sufficient detail to meet the minimum content requirements."
        };

        // Act - No need to set authorization header as test auth is configured
        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("Answer created successfully", content);
    }

    [Fact]
    public async Task CreateAnswer_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var request = new CreateAnswerRequest
        {
            QuestionId = Guid.NewGuid(),
            Content = "Short" // Too short, doesn't meet minimum requirements
        };

        // Act - No need to set authorization header as test auth is configured
        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetMyAnswers_WithAuthentication_ReturnsUserAnswers()
    {
        // Act - No need to set authorization header as test auth is configured
        var response = await Client.GetAsync("/api/v7/qa/answers/my-answers?pageSize=5");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotNull(content);
        Assert.Contains("User answers retrieved successfully", content);
    }

}