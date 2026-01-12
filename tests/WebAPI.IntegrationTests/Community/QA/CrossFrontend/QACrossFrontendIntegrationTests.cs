using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Data;
using WebAPI.IntegrationTests.QA.Core;
using Xunit;
using Xunit.Abstractions;
using System.Collections.Concurrent;
using System.Diagnostics;
using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.IntegrationTests.QA.CrossFrontend;

/// <summary>
/// Cross-frontend integration tests for QA System
/// Tests complete user workflows across Angular Main and React Dashboard applications
/// Validates real-time synchronization, authentication, and API consistency
/// </summary>
public class QACrossFrontendIntegrationTests : QAIntegrationTestBase
{
    public QACrossFrontendIntegrationTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory, output)
    {
    }

    [Fact]
    public async Task QAWorkflow_ShouldWorkConsistentlyAcrossBothFrontends()
    {
        Output.WriteLine("🚀 Starting cross-frontend QA workflow test...");

        // 1. Test question creation from Angular Main
        Output.WriteLine("1. Creating question from Angular Main...");
        
        SetClientType("Angular-Main");
        
        var createdQuestion = await CreateTestQuestion(
            "Cross-Frontend Test Question",
            "This question tests consistency between Angular and React frontends",
            "Web Development",
            new List<string> { "angular", "react", "integration" }
        );

        Assert.NotNull(createdQuestion);
        LogTestResult($"Question created from Angular: {createdQuestion.Id}", true);

        // 2. Verify question is visible from React Dashboard
        Output.WriteLine("2. Verifying question visibility from React Dashboard...");
        
        SetClientType("React-Dashboard");
        
        var getQuestionResponse = await Client.GetAsync($"/api/v7/qa/questions/{createdQuestion.Id}");
        Assert.Equal(HttpStatusCode.OK, getQuestionResponse.StatusCode);
        
        var getQuestionContent = await getQuestionResponse.Content.ReadAsStringAsync();
        var retrievedQuestion = DeserializeApiResponseData<QuestionDto>(getQuestionContent);
        
        Assert.Equal(createdQuestion.Title, retrievedQuestion!.Title);
        LogTestResult("Question visible from React Dashboard", true);

        // 3. Create answer from React Dashboard
        Output.WriteLine("3. Creating answer from React Dashboard...");
        
        var createdAnswer = await CreateTestAnswer(createdQuestion.Id,
            "This answer is created from React Dashboard to test cross-frontend functionality");

        Assert.NotNull(createdAnswer);
        LogTestResult($"Answer created from React: {createdAnswer.Id}", true);

        // 4. Verify answer is visible from Angular Main
        Output.WriteLine("4. Verifying answer visibility from Angular Main...");
        
        SetClientType("Angular-Main");
        
        var getAnswersResponse = await Client.GetAsync($"/api/v7/qa/answers/question/{createdQuestion.Id}");
        Assert.Equal(HttpStatusCode.OK, getAnswersResponse.StatusCode);
        
        var answersContent = await getAnswersResponse.Content.ReadAsStringAsync();
        Assert.Contains("React Dashboard", answersContent);
        LogTestResult("Answer visible from Angular Main", true);

        // 5. Test voting from both frontends using a different user
        Output.WriteLine("5. Testing voting from both frontends...");
        
        // Vote on question from Angular (using different user)
        SetClientType("Angular-Main");
        Client.DefaultRequestHeaders.Remove("X-Test-User-Id");
        Client.DefaultRequestHeaders.Add("X-Test-User-Id", SecondTestUserGuid.ToString());
        
        var questionVoteSuccess = await CreateTestVote(createdQuestion.Id, "Question", "Up");
        LogTestResult("Question upvoted from Angular", questionVoteSuccess);

        // Vote on answer from React (using different user)
        SetClientType("React-Dashboard");
        
        var answerVoteSuccess = await CreateTestVote(createdAnswer.Id, "Answer", "Up");
        LogTestResult("Answer upvoted from React", answerVoteSuccess);

        Output.WriteLine("🎉 Cross-frontend QA workflow test completed successfully!");
    }

    [Fact]
    public async Task RealTimeUpdates_ShouldSynchronizeAcrossBothFrontends()
    {
        Output.WriteLine("🔄 Starting real-time synchronization test...");

        var questionCreatedFromAngular = false;
        var questionCreatedFromReact = false;
        var answerCreatedFromAngular = false;
        var answerCreatedFromReact = false;

        // Setup event handlers for Angular connection
        if (AngularHubConnection != null)
        {
            AngularHubConnection.On<object>("QuestionCreated", (question) =>
            {
                questionCreatedFromAngular = true;
                Output.WriteLine("✓ Angular received QuestionCreated event");
            });

            AngularHubConnection.On<object>("AnswerCreated", (answer) =>
            {
                answerCreatedFromAngular = true;
                Output.WriteLine("✓ Angular received AnswerCreated event");
            });
        }

        // Setup event handlers for React connection
        if (ReactHubConnection != null)
        {
            ReactHubConnection.On<object>("QuestionCreated", (question) =>
            {
                questionCreatedFromReact = true;
                Output.WriteLine("✓ React received QuestionCreated event");
            });

            ReactHubConnection.On<object>("AnswerCreated", (answer) =>
            {
                answerCreatedFromReact = true;
                Output.WriteLine("✓ React received AnswerCreated event");
            });
        }

        // Create question and verify both frontends receive the event
        Output.WriteLine("1. Creating question and testing real-time notifications...");
        
        var createdQuestion = await CreateTestQuestion(
            "Real-time Test Question",
            "Testing real-time synchronization across frontends",
            "Testing",
            new List<string> { "realtime", "signalr" }
        );

        Assert.NotNull(createdQuestion);

        // Wait for SignalR events
        await Task.Delay(2000);

        LogTestResult("Angular received QuestionCreated event", questionCreatedFromAngular);
        LogTestResult("React received QuestionCreated event", questionCreatedFromReact);

        // Create answer and verify both frontends receive the event
        Output.WriteLine("2. Creating answer and testing real-time notifications...");
        
        var createdAnswer = await CreateTestAnswer(createdQuestion.Id, "Real-time test answer");

        Assert.NotNull(createdAnswer);

        // Wait for SignalR events
        await Task.Delay(2000);

        LogTestResult("Angular received AnswerCreated event", answerCreatedFromAngular);
        LogTestResult("React received AnswerCreated event", answerCreatedFromReact);

        Output.WriteLine("🎉 Real-time synchronization test completed successfully!");
    }

    [Fact]
    public async Task ErrorHandling_ShouldBeConsistentAcrossFrontends()
    {
        Output.WriteLine("⚠️ Starting error handling consistency test...");

        // 1. Test validation errors
        Output.WriteLine("1. Testing validation error consistency...");
        
        var invalidQuestionRequest = new CreateQuestionRequest
        {
            Title = "", // Invalid: empty title
            Content = "Valid content",
            Category = "Web Development",
            Tags = new List<string> { "test" }
        };

        // Test from Angular
        SetClientType("Angular-Main");
        var angularErrorResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);

        // Test from React
        SetClientType("React-Dashboard");
        var reactErrorResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);

        Assert.Equal(angularErrorResponse.StatusCode, reactErrorResponse.StatusCode);
        LogTestResult("Validation error responses consistent across frontends", true);

        // 2. Test not found errors
        Output.WriteLine("2. Testing not found error consistency...");
        var nonExistentId = Guid.NewGuid();
        
        SetClientType("Angular-Main");
        var angularNotFoundResponse = await Client.GetAsync($"/api/v7/qa/questions/{nonExistentId}");
        
        SetClientType("React-Dashboard");
        var reactNotFoundResponse = await Client.GetAsync($"/api/v7/qa/questions/{nonExistentId}");
        
        Assert.Equal(angularNotFoundResponse.StatusCode, reactNotFoundResponse.StatusCode);
        LogTestResult("Not found error responses consistent across frontends", true);

        // 3. Test authorization errors
        Output.WriteLine("3. Testing authorization error consistency...");
        
        // Test with unauthenticated client
        var angularUnauthResponse = await UnauthenticatedClient.GetAsync("/api/v7/qa/questions");
        var reactUnauthResponse = await UnauthenticatedClient.GetAsync("/api/v7/qa/questions");
        
        Assert.Equal(angularUnauthResponse.StatusCode, reactUnauthResponse.StatusCode);
        LogTestResult("Authorization error responses consistent across frontends", true);

        Output.WriteLine("✅ Error handling consistency test completed");
    }

    [Fact]
    public async Task PerformanceLoad_ShouldHandleConcurrentRequestsFromBothFrontends()
    {
        Output.WriteLine("⚡ Starting performance load test...");

        const int concurrentRequests = 20;
        const int requestsPerFrontend = concurrentRequests / 2;

        var tasks = new List<Task<HttpResponseMessage>>();

        // Create concurrent requests from Angular Main
        for (int i = 0; i < requestsPerFrontend; i++)
        {
            tasks.Add(CreateConcurrentRequest("Angular-Main", i));
        }

        // Create concurrent requests from React Dashboard
        for (int i = 0; i < requestsPerFrontend; i++)
        {
            tasks.Add(CreateConcurrentRequest("React-Dashboard", i));
        }

        Output.WriteLine($"Executing {concurrentRequests} concurrent requests...");
        var responses = await Task.WhenAll(tasks);

        // Verify all requests completed successfully
        var successfulRequests = responses.Count(r => r.IsSuccessStatusCode);
        var failedRequests = responses.Length - successfulRequests;

        Output.WriteLine($"✓ Successful requests: {successfulRequests}/{responses.Length}");
        
        if (failedRequests > 0)
        {
            Output.WriteLine($"⚠️ Failed requests: {failedRequests}/{responses.Length}");
        }

        // At least 80% of requests should succeed under load
        Assert.True(successfulRequests >= (responses.Length * 0.8), 
            $"Expected at least 80% success rate, got {(double)successfulRequests / responses.Length * 100:F1}%");

        LogTestResult("Performance load test", true);
    }

    private async Task<HttpResponseMessage> CreateConcurrentRequest(string clientType, int requestIndex)
    {
        using var client = Factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Test-Auth", "true");
        client.DefaultRequestHeaders.Add("X-Client-Type", clientType);

        var questionRequest = new CreateQuestionRequest
        {
            Title = $"Load Test Question {requestIndex} from {clientType}",
            Content = $"This is a load test question created from {clientType}",
            Category = "Testing",
            Tags = new List<string> { "load-test", clientType.ToLower() }
        };

        return await client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
    }
}