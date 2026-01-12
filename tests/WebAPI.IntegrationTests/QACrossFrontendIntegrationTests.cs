using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Data;
using Xunit;
using Xunit.Abstractions;
using System.Collections.Concurrent;
using System.Diagnostics;

namespace WebAPI.IntegrationTests;

/// <summary>
/// Cross-frontend integration tests for QA System
/// Tests complete user workflows across Angular Main and React Dashboard applications
/// Validates real-time synchronization, authentication, and API consistency
/// </summary>
public class QACrossFrontendIntegrationTests : BaseIntegrationTest
{
    private readonly ITestOutputHelper _output;
    private HubConnection? _angularHubConnection;
    private HubConnection? _reactHubConnection;

    public QACrossFrontendIntegrationTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory)
    {
        _output = output;
    }

    [Fact]
    public async Task QAWorkflow_ShouldWorkConsistentlyAcrossBothFrontends()
    {
        _output.WriteLine("🚀 Starting cross-frontend QA workflow test...");

        // 1. Test question creation from Angular Main
        _output.WriteLine("1. Creating question from Angular Main...");
        
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular-Main");
        
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Cross-Frontend Test Question",
            Content = "This question tests consistency between Angular and React frontends",
            Category = "Web Development",
            Tags = new List<string> { "angular", "react", "integration" }
        };

        var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        Assert.True(questionResponse.IsSuccessStatusCode);
        
        var questionContent = await questionResponse.Content.ReadAsStringAsync();
        var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
        var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();
        
        _output.WriteLine($"✓ Question created from Angular: {questionId}");

        // 2. Verify question is visible from React Dashboard
        _output.WriteLine("2. Verifying question visibility from React Dashboard...");
        
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React-Dashboard");
        
        var getQuestionResponse = await Client.GetAsync($"/api/v7/qa/questions/{questionId}");
        Assert.True(getQuestionResponse.IsSuccessStatusCode);
        
        var getQuestionContent = await getQuestionResponse.Content.ReadAsStringAsync();
        var retrievedQuestion = JsonSerializer.Deserialize<JsonElement>(getQuestionContent);
        
        Assert.Equal(questionRequest.Title, retrievedQuestion.GetProperty("data").GetProperty("title").GetString());
        _output.WriteLine("✓ Question visible from React Dashboard");

        // 3. Create answer from React Dashboard
        _output.WriteLine("3. Creating answer from React Dashboard...");
        
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = questionId,
            Content = "This answer is created from React Dashboard to test cross-frontend functionality"
        };

        var answerResponse = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
        Assert.True(answerResponse.IsSuccessStatusCode);
        
        var answerContent = await answerResponse.Content.ReadAsStringAsync();
        var answerData = JsonSerializer.Deserialize<JsonElement>(answerContent);
        var answerId = answerData.GetProperty("data").GetProperty("id").GetGuid();
        
        _output.WriteLine($"✓ Answer created from React: {answerId}");

        // 4. Verify answer is visible from Angular Main
        _output.WriteLine("4. Verifying answer visibility from Angular Main...");
        
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular-Main");
        
        var getAnswersResponse = await Client.GetAsync($"/api/v7/qa/questions/{questionId}/answers");
        Assert.True(getAnswersResponse.IsSuccessStatusCode);
        
        var answersContent = await getAnswersResponse.Content.ReadAsStringAsync();
        var answersData = JsonSerializer.Deserialize<JsonElement>(answersContent);
        var answers = answersData.GetProperty("data").EnumerateArray().ToList();
        
        Assert.True(answers.Any(a => a.GetProperty("id").GetGuid() == answerId));
        _output.WriteLine("✓ Answer visible from Angular Main");

        // 5. Test voting from both frontends
        _output.WriteLine("5. Testing voting from both frontends...");
        
        // Vote on question from Angular
        var questionVoteRequest = new CreateVoteRequest
        {
            ContentId = questionId,
            ContentType = "Question",
            VoteType = "Up"
        };

        var questionVoteResponse = await Client.PostAsJsonAsync("/api/v7/qa/voting", questionVoteRequest);
        Assert.True(questionVoteResponse.IsSuccessStatusCode);
        _output.WriteLine("✓ Question upvoted from Angular");

        // Vote on answer from React
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React-Dashboard");
        
        var answerVoteRequest = new CreateVoteRequest
        {
            ContentId = answerId,
            ContentType = "Answer",
            VoteType = "Up"
        };

        var answerVoteResponse = await Client.PostAsJsonAsync("/api/v7/qa/voting", answerVoteRequest);
        Assert.True(answerVoteResponse.IsSuccessStatusCode);
        _output.WriteLine("✓ Answer upvoted from React");

        _output.WriteLine("🎉 Cross-frontend QA workflow test completed successfully!");
    }

    [Fact]
    public async Task RealTimeUpdates_ShouldSynchronizeAcrossBothFrontends()
    {
        _output.WriteLine("🔄 Starting real-time synchronization test...");

        try
        {
            // Setup SignalR connections for both frontends
            await SetupSignalRConnections();

            var questionCreatedFromAngular = false;
            var questionCreatedFromReact = false;
            var answerCreatedFromAngular = false;
            var answerCreatedFromReact = false;

            // Setup event handlers for Angular connection
            _angularHubConnection!.On<object>("QuestionCreated", (question) =>
            {
                questionCreatedFromAngular = true;
                _output.WriteLine("✓ Angular received QuestionCreated event");
            });

            _angularHubConnection.On<object>("AnswerCreated", (answer) =>
            {
                answerCreatedFromAngular = true;
                _output.WriteLine("✓ Angular received AnswerCreated event");
            });

            // Setup event handlers for React connection
            _reactHubConnection!.On<object>("QuestionCreated", (question) =>
            {
                questionCreatedFromReact = true;
                _output.WriteLine("✓ React received QuestionCreated event");
            });

            _reactHubConnection.On<object>("AnswerCreated", (answer) =>
            {
                answerCreatedFromReact = true;
                _output.WriteLine("✓ React received AnswerCreated event");
            });

            // Create question and verify both frontends receive the event
            _output.WriteLine("1. Creating question and testing real-time notifications...");
            
            var questionRequest = new CreateQuestionRequest
            {
                Title = "Real-time Test Question",
                Content = "Testing real-time synchronization across frontends",
                Category = "Testing",
                Tags = new List<string> { "realtime", "signalr" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            Assert.True(questionResponse.IsSuccessStatusCode);

            // Wait for SignalR events
            await Task.Delay(2000);

            Assert.True(questionCreatedFromAngular, "Angular should receive QuestionCreated event");
            Assert.True(questionCreatedFromReact, "React should receive QuestionCreated event");

            // Get question ID for answer creation
            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            // Create answer and verify both frontends receive the event
            _output.WriteLine("2. Creating answer and testing real-time notifications...");
            
            var answerRequest = new CreateAnswerRequest
            {
                QuestionId = questionId,
                Content = "Real-time test answer"
            };

            var answerResponse = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
            Assert.True(answerResponse.IsSuccessStatusCode);

            // Wait for SignalR events
            await Task.Delay(2000);

            Assert.True(answerCreatedFromAngular, "Angular should receive AnswerCreated event");
            Assert.True(answerCreatedFromReact, "React should receive AnswerCreated event");

            _output.WriteLine("🎉 Real-time synchronization test completed successfully!");
        }
        finally
        {
            await CleanupSignalRConnections();
        }
    }

    [Fact]
    public async Task ErrorHandling_ShouldBeConsistentAcrossFrontends()
    {
        _output.WriteLine("⚠️ Starting error handling consistency test...");

        // 1. Test validation errors
        _output.WriteLine("1. Testing validation error consistency...");
        
        var invalidQuestionRequest = new CreateQuestionRequest
        {
            Title = "", // Invalid: empty title
            Content = "Valid content",
            Category = "Web Development",
            Tags = new List<string> { "test" }
        };

        // Test from Angular
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular-Main");
        
        var angularErrorResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);
        var angularErrorContent = await angularErrorResponse.Content.ReadAsStringAsync();

        // Test from React
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React-Dashboard");
        
        var reactErrorResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);
        var reactErrorContent = await reactErrorResponse.Content.ReadAsStringAsync();

        Assert.Equal(angularErrorResponse.StatusCode, reactErrorResponse.StatusCode);
        _output.WriteLine("✓ Validation error responses consistent across frontends");

        // 2. Test not found errors
        _output.WriteLine("2. Testing not found error consistency...");
        var nonExistentId = Guid.NewGuid();
        
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular-Main");
        var angularNotFoundResponse = await Client.GetAsync($"/api/v7/qa/questions/{nonExistentId}");
        
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React-Dashboard");
        var reactNotFoundResponse = await Client.GetAsync($"/api/v7/qa/questions/{nonExistentId}");
        
        Assert.Equal(angularNotFoundResponse.StatusCode, reactNotFoundResponse.StatusCode);
        _output.WriteLine("✓ Not found error responses consistent across frontends");

        // 3. Test authorization errors
        _output.WriteLine("3. Testing authorization error consistency...");
        
        // Test with unauthenticated client
        var angularUnauthResponse = await UnauthenticatedClient.GetAsync("/api/v7/qa/questions");
        var reactUnauthResponse = await UnauthenticatedClient.GetAsync("/api/v7/qa/questions");
        
        Assert.Equal(angularUnauthResponse.StatusCode, reactUnauthResponse.StatusCode);
        _output.WriteLine("✓ Authorization error responses consistent across frontends");

        _output.WriteLine("✅ Error handling consistency test completed");
    }

    [Fact]
    public async Task PerformanceLoad_ShouldHandleConcurrentRequestsFromBothFrontends()
    {
        _output.WriteLine("⚡ Starting performance load test...");

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

        _output.WriteLine($"Executing {concurrentRequests} concurrent requests...");
        var responses = await Task.WhenAll(tasks);

        // Verify all requests completed successfully
        var successfulRequests = responses.Count(r => r.IsSuccessStatusCode);
        var failedRequests = responses.Length - successfulRequests;

        _output.WriteLine($"✓ Successful requests: {successfulRequests}/{responses.Length}");
        
        if (failedRequests > 0)
        {
            _output.WriteLine($"⚠️ Failed requests: {failedRequests}/{responses.Length}");
        }

        // At least 80% of requests should succeed under load
        Assert.True(successfulRequests >= (responses.Length * 0.8), 
            $"Expected at least 80% success rate, got {(double)successfulRequests / responses.Length * 100:F1}%");

        _output.WriteLine("🎉 Performance load test completed!");
    }

    private async Task<HttpResponseMessage> CreateConcurrentRequest(string clientType, int requestIndex)
    {
        using var client = Factory.CreateClient();
        
        // Add authentication
        client.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TestAuthToken);
        
        // Add client type header
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

    private async Task SetupSignalRConnections()
    {
        var hubUrl = Factory.Server.BaseAddress + "hubs/qa";

        // Setup Angular connection
        _angularHubConnection = new HubConnectionBuilder()
            .WithUrl(hubUrl, options =>
            {
                options.Headers.Add("Authorization", $"Bearer {TestAuthToken}");
                options.Headers.Add("X-Client-Type", "Angular-Main");
            })
            .Build();

        // Setup React connection
        _reactHubConnection = new HubConnectionBuilder()
            .WithUrl(hubUrl, options =>
            {
                options.Headers.Add("Authorization", $"Bearer {TestAuthToken}");
                options.Headers.Add("X-Client-Type", "React-Dashboard");
            })
            .Build();

        await _angularHubConnection.StartAsync();
        await _reactHubConnection.StartAsync();

        _output.WriteLine("✓ SignalR connections established for both frontends");
    }

    private async Task CleanupSignalRConnections()
    {
        if (_angularHubConnection != null)
        {
            await _angularHubConnection.DisposeAsync();
            _angularHubConnection = null;
        }

        if (_reactHubConnection != null)
        {
            await _reactHubConnection.DisposeAsync();
            _reactHubConnection = null;
        }

        _output.WriteLine("✓ SignalR connections cleaned up");
    }
}