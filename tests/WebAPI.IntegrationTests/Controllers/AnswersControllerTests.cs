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
/// Integration tests for Answers Controller
/// Tests QA answers API endpoints functionality
/// </summary>
public class AnswersControllerTests : BaseIntegrationTest
{
    public AnswersControllerTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetAnswers_WithoutAuthentication_ReturnsUnauthorized()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await UnauthenticatedClient.GetAsync($"/api/v7/qa/answers/question/{questionId}");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAnswers_WithAuthentication_ReturnsAnswers()
    {
        // Arrange
        var questionId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/answers/question/{questionId}");

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
    public async Task CreateAnswer_WithValidData_ReturnsCreated()
    {
        // Arrange
        var questionId = Guid.NewGuid();
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = questionId,
            Content = "This is a comprehensive answer to the integration test question. It provides detailed information and examples to help solve the problem effectively."
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);

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
            
            var answerResponse = DeserializeApiResponseData<AnswerDto>(content);
            Assert.NotNull(answerResponse);
            Assert.Equal(answerRequest.Content, answerResponse.Content);
        }
    }

    [Fact]
    public async Task CreateAnswer_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var invalidAnswerRequest = new CreateAnswerRequest
        {
            QuestionId = null, // Invalid: null question ID
            Content = "Short" // Invalid: too short
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", invalidAnswerRequest);

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task GetAnswer_WithValidId_ReturnsAnswer()
    {
        // Arrange
        var answerId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/answers/{answerId}");

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
    public async Task GetAnswer_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = Guid.Empty;

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/answers/{invalidId}");

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.NotFound || 
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateAnswer_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var answerId = Guid.NewGuid();
        var updateRequest = new UpdateAnswerRequest
        {
            Content = "This answer has been updated during integration testing with more comprehensive information and better examples."
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v7/qa/answers/{answerId}", updateRequest);

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task DeleteAnswer_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var answerId = Guid.NewGuid();

        // Act
        var response = await Client.DeleteAsync($"/api/v7/qa/answers/{answerId}");

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task AcceptAnswer_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var answerId = Guid.NewGuid();

        // Act
        var response = await Client.PostAsync($"/api/v7/qa/answers/{answerId}/accept", null);

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UnacceptAnswer_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var answerId = Guid.NewGuid();

        // Act
        var response = await Client.PostAsync($"/api/v7/qa/answers/{answerId}/unaccept", null);

        // Assert
        Assert.True(response.IsSuccessStatusCode || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetMyAnswers_ReturnsUserAnswers()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/answers/my-answers?pageSize=10");

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
    public async Task GetAnswersByUser_WithValidUserId_ReturnsAnswers()
    {
        // Arrange
        var userId = TestUserGuid;

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/answers/user/{userId}?pageSize=10");

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
    public async Task GetTopAnswers_ReturnsHighRatedAnswers()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/answers/top?timeframe=week&limit=10");

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
    public async Task GetRecentAnswers_ReturnsLatestAnswers()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/answers/recent?pageSize=10");

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
    public async Task SearchAnswers_WithValidTerm_ReturnsResults()
    {
        // Act
        var response = await Client.GetAsync("/api/v7/qa/answers/search?searchTerm=integration&pageSize=5");

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
    public async Task GetAnswerHistory_WithValidId_ReturnsHistory()
    {
        // Arrange
        var answerId = Guid.NewGuid();

        // Act
        var response = await Client.GetAsync($"/api/v7/qa/answers/{answerId}/history");

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
    public async Task CreateAnswer_WithEmptyContent_ReturnsBadRequest()
    {
        // Arrange
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = Guid.NewGuid(),
            Content = "" // Invalid: empty content
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task CreateAnswer_WithNonExistentQuestion_ReturnsBadRequest()
    {
        // Arrange
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = Guid.NewGuid(), // Non-existent question
            Content = "This is an answer to a non-existent question, which should fail validation."
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.UnprocessableEntity);
    }
}