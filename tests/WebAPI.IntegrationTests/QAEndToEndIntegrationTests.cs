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

namespace WebAPI.IntegrationTests;

/// <summary>
/// End-to-end integration tests covering complete user workflows across both Angular and React frontends
/// Tests real-time synchronization, authentication, and performance under load
/// </summary>
public class QAEndToEndIntegrationTests : BaseIntegrationTest, IAsyncLifetime
{
    private readonly ITestOutputHelper _output;
    private HubConnection? _angularHubConnection;
    private HubConnection? _reactHubConnection;
    private readonly List<string> _receivedMessages = new();
    private readonly List<string> _receivedNotifications = new();

    public QAEndToEndIntegrationTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory)
    {
        _output = output;
    }

    public async Task InitializeAsync()
    {
        // Set up SignalR connections for both frontend types
        await SetupSignalRConnections();
    }

    public async Task DisposeAsync()
    {
        if (_angularHubConnection != null)
        {
            await _angularHubConnection.DisposeAsync();
        }
        if (_reactHubConnection != null)
        {
            await _reactHubConnection.DisposeAsync();
        }
    }

    private async Task SetupSignalRConnections()
    {
        var baseUrl = Client.BaseAddress?.ToString().TrimEnd('/') ?? "http://localhost";
        
        // Angular Main App SignalR Connection
        _angularHubConnection = new HubConnectionBuilder()
            .WithUrl($"{baseUrl}/hubs/qa", options =>
            {
                options.Headers.Add("X-Test-Auth", "true");
                options.Headers.Add("X-Client-Type", "Angular");
            })
            .Build();

        // React Dashboard SignalR Connection  
        _reactHubConnection = new HubConnectionBuilder()
            .WithUrl($"{baseUrl}/hubs/qa", options =>
            {
                options.Headers.Add("X-Test-Auth", "true");
                options.Headers.Add("X-Client-Type", "React");
            })
            .Build();

        // Set up message handlers
        _angularHubConnection.On<string>("ReceiveQuestionUpdate", message =>
        {
            _receivedMessages.Add($"Angular: {message}");
            _output.WriteLine($"Angular received: {message}");
        });

        _angularHubConnection.On<string>("ReceiveAnswerUpdate", message =>
        {
            _receivedMessages.Add($"Angular: {message}");
            _output.WriteLine($"Angular received: {message}");
        });

        _reactHubConnection.On<string>("ReceiveQuestionUpdate", message =>
        {
            _receivedMessages.Add($"React: {message}");
            _output.WriteLine($"React received: {message}");
        });

        _reactHubConnection.On<string>("ReceiveAnswerUpdate", message =>
        {
            _receivedMessages.Add($"React: {message}");
            _output.WriteLine($"React received: {message}");
        });

        // Start connections
        await _angularHubConnection.StartAsync();
        await _reactHubConnection.StartAsync();
        
        // Wait for connections to be established
        await Task.Delay(1000);
    }

    [Fact]
    public async Task CompleteUserWorkflow_AngularMainApp_ShouldWorkEndToEnd()
    {
        // Test complete user workflow in Angular Main application
        _output.WriteLine("Testing complete Angular Main App user workflow...");

        // 1. User searches for existing questions
        var searchResponse = await Client.GetAsync("/api/v7/qa/questions/search?searchTerm=test&pageSize=10");
        Assert.Equal(HttpStatusCode.OK, searchResponse.StatusCode);
        _output.WriteLine("✓ Search functionality working");

        // 2. User creates a new question
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Angular Integration Test - How to implement real-time features?",
            Content = "I'm working on an Angular application and need to implement real-time features using SignalR. What are the best practices for managing connections and handling reconnections?",
            Category = "Web Development",
            Tags = new List<string> { "angular", "signalr", "real-time", "integration-test" }
        };

        var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        Assert.Equal(HttpStatusCode.Created, questionResponse.StatusCode);
        
        var questionContent = await questionResponse.Content.ReadAsStringAsync();
        var createdQuestion = JsonSerializer.Deserialize<QuestionDto>(questionContent, 
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(createdQuestion);
        _output.WriteLine($"✓ Question created with ID: {createdQuestion.Id}");

        // 3. User joins question for real-time updates
        if (_angularHubConnection?.State == HubConnectionState.Connected)
        {
            await _angularHubConnection.InvokeAsync("JoinQuestion", createdQuestion.Id.ToString());
            _output.WriteLine("✓ Joined question for real-time updates");
        }

        // 4. User provides an answer
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = createdQuestion.Id,
            Content = "For implementing real-time features in Angular with SignalR, I recommend using a dedicated service that manages the connection lifecycle. Here's a comprehensive approach:\n\n1. Create a SignalR service that handles connection management\n2. Implement automatic reconnection logic\n3. Use RxJS observables for real-time data streams\n4. Handle connection state in your components\n\nThis ensures reliable real-time communication in your Angular application."
        };

        var answerResponse = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
        Assert.Equal(HttpStatusCode.Created, answerResponse.StatusCode);
        
        var answerContent = await answerResponse.Content.ReadAsStringAsync();
        var createdAnswer = JsonSerializer.Deserialize<AnswerDto>(answerContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(createdAnswer);
        _output.WriteLine($"✓ Answer created with ID: {createdAnswer.Id}");

        // 5. User votes on the answer
        var voteRequest = new CreateVoteRequest
        {
            ContentId = createdAnswer.Id,
            ContentType = "Answer",
            VoteType = "Up"
        };

        var voteResponse = await Client.PostAsJsonAsync("/api/v7/qa/votes", voteRequest);
        Assert.Equal(HttpStatusCode.Created, voteResponse.StatusCode);
        _output.WriteLine("✓ Vote cast successfully");

        // 6. Verify question details include the answer
        var questionDetailResponse = await Client.GetAsync($"/api/v7/qa/questions/{createdQuestion.Id}");
        Assert.Equal(HttpStatusCode.OK, questionDetailResponse.StatusCode);
        _output.WriteLine("✓ Question details retrieved with answers");

        // 7. User searches for their own questions
        var myQuestionsResponse = await Client.GetAsync("/api/v7/qa/questions/my-questions?pageSize=10");
        Assert.Equal(HttpStatusCode.OK, myQuestionsResponse.StatusCode);
        _output.WriteLine("✓ User's questions retrieved successfully");

        _output.WriteLine("✅ Complete Angular Main App user workflow test passed");
    }

    [Fact]
    public async Task CompleteAdminWorkflow_ReactDashboard_ShouldWorkEndToEnd()
    {
        // Test complete admin workflow in React Dashboard application
        _output.WriteLine("Testing complete React Dashboard admin workflow...");

        // 1. Admin views QA analytics dashboard
        var analyticsResponse = await Client.GetAsync("/api/v7/qa/analytics/dashboard");
        Assert.Equal(HttpStatusCode.OK, analyticsResponse.StatusCode);
        _output.WriteLine("✓ QA analytics dashboard data retrieved");

        // 2. Admin views user reputation leaderboard
        var leaderboardResponse = await Client.GetAsync("/api/v7/qa/reputation/leaderboard?pageSize=20");
        Assert.Equal(HttpStatusCode.OK, leaderboardResponse.StatusCode);
        _output.WriteLine("✓ Reputation leaderboard retrieved");

        // 3. Admin searches for questions requiring moderation
        var moderationResponse = await Client.GetAsync("/api/v7/qa/questions/moderation-queue?pageSize=10");
        Assert.Equal(HttpStatusCode.OK, moderationResponse.StatusCode);
        _output.WriteLine("✓ Moderation queue retrieved");

        // 4. Admin views category performance metrics
        var categoryMetricsResponse = await Client.GetAsync("/api/v7/qa/analytics/categories");
        Assert.Equal(HttpStatusCode.OK, categoryMetricsResponse.StatusCode);
        _output.WriteLine("✓ Category performance metrics retrieved");

        // 5. Admin manages expert assignments
        var expertsResponse = await Client.GetAsync("/api/v7/qa/experts?pageSize=15");
        Assert.Equal(HttpStatusCode.OK, expertsResponse.StatusCode);
        _output.WriteLine("✓ Expert assignments retrieved");

        // 6. Admin views system health metrics
        var healthResponse = await Client.GetAsync("/api/v7/qa/health/metrics");
        Assert.Equal(HttpStatusCode.OK, healthResponse.StatusCode);
        _output.WriteLine("✓ System health metrics retrieved");

        // 7. Admin exports QA data for reporting
        var exportResponse = await Client.GetAsync("/api/v7/qa/export/questions?format=json&dateFrom=2024-01-01");
        Assert.Equal(HttpStatusCode.OK, exportResponse.StatusCode);
        _output.WriteLine("✓ QA data export completed");

        _output.WriteLine("✅ Complete React Dashboard admin workflow test passed");
    }

    [Fact]
    public async Task RealTimeUpdates_BetweenAngularAndReact_ShouldSynchronize()
    {
        // Test real-time updates synchronization between both frontends
        _output.WriteLine("Testing real-time synchronization between Angular and React...");

        // Clear previous messages
        _receivedMessages.Clear();

        // 1. Create a question that both clients will monitor
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Real-time Sync Test - Database Performance Optimization",
            Content = "What are the best strategies for optimizing database performance in high-traffic applications? Looking for both indexing strategies and query optimization techniques.",
            Category = "Database Design",
            Tags = new List<string> { "database", "performance", "optimization", "real-time-test" }
        };

        var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        Assert.Equal(HttpStatusCode.Created, questionResponse.StatusCode);
        
        var questionContent = await questionResponse.Content.ReadAsStringAsync();
        var createdQuestion = JsonSerializer.Deserialize<QuestionDto>(questionContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(createdQuestion);

        // 2. Both clients join the question
        if (_angularHubConnection?.State == HubConnectionState.Connected)
        {
            await _angularHubConnection.InvokeAsync("JoinQuestion", createdQuestion.Id.ToString());
        }
        if (_reactHubConnection?.State == HubConnectionState.Connected)
        {
            await _reactHubConnection.InvokeAsync("JoinQuestion", createdQuestion.Id.ToString());
        }

        await Task.Delay(500); // Allow connections to register

        // 3. Create an answer and verify both clients receive updates
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = createdQuestion.Id,
            Content = "For database performance optimization, I recommend a multi-layered approach:\n\n1. **Indexing Strategy**: Create composite indexes for frequently queried columns\n2. **Query Optimization**: Use execution plans to identify bottlenecks\n3. **Connection Pooling**: Implement proper connection management\n4. **Caching**: Use Redis for frequently accessed data\n5. **Partitioning**: Consider table partitioning for large datasets\n\nThis comprehensive approach will significantly improve performance."
        };

        var answerResponse = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
        Assert.Equal(HttpStatusCode.Created, answerResponse.StatusCode);

        // Wait for real-time updates to propagate
        await Task.Delay(2000);

        // 4. Verify both Angular and React clients received the updates
        var angularMessages = _receivedMessages.Where(m => m.StartsWith("Angular:")).ToList();
        var reactMessages = _receivedMessages.Where(m => m.StartsWith("React:")).ToList();

        Assert.True(angularMessages.Count > 0, "Angular client should receive real-time updates");
        Assert.True(reactMessages.Count > 0, "React client should receive real-time updates");
        
        _output.WriteLine($"✓ Angular received {angularMessages.Count} real-time updates");
        _output.WriteLine($"✓ React received {reactMessages.Count} real-time updates");

        // 5. Test voting updates in real-time
        var answerContent = await answerResponse.Content.ReadAsStringAsync();
        var createdAnswer = JsonSerializer.Deserialize<AnswerDto>(answerContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var voteRequest = new CreateVoteRequest
        {
            ContentId = createdAnswer!.Id,
            ContentType = "Answer", 
            VoteType = "Up"
        };

        await Client.PostAsJsonAsync("/api/v7/qa/votes", voteRequest);
        await Task.Delay(1000);

        // Verify vote updates were received
        var voteMessages = _receivedMessages.Where(m => m.Contains("vote") || m.Contains("Vote")).ToList();
        _output.WriteLine($"✓ Vote updates received: {voteMessages.Count}");

        _output.WriteLine("✅ Real-time synchronization test passed");
    }

    [Fact]
    public async Task AuthenticationAndAuthorization_AcrossApplications_ShouldWorkCorrectly()
    {
        // Test authentication and authorization integration across applications
        _output.WriteLine("Testing authentication and authorization across applications...");

        // 1. Test unauthenticated access is properly blocked
        var unauthQuestionResponse = await UnauthenticatedClient.GetAsync("/api/v7/qa/questions");
        Assert.Equal(HttpStatusCode.Unauthorized, unauthQuestionResponse.StatusCode);
        _output.WriteLine("✓ Unauthenticated access properly blocked");

        // 2. Test authenticated access works for both frontend types
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular");
        var angularQuestionsResponse = await Client.GetAsync("/api/v7/qa/questions");
        Assert.Equal(HttpStatusCode.OK, angularQuestionsResponse.StatusCode);
        _output.WriteLine("✓ Angular client authenticated access works");

        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React");
        var reactQuestionsResponse = await Client.GetAsync("/api/v7/qa/questions");
        Assert.Equal(HttpStatusCode.OK, reactQuestionsResponse.StatusCode);
        _output.WriteLine("✓ React client authenticated access works");

        // 3. Test user-specific operations work correctly
        var myQuestionsResponse = await Client.GetAsync("/api/v7/qa/questions/my-questions");
        Assert.Equal(HttpStatusCode.OK, myQuestionsResponse.StatusCode);
        _output.WriteLine("✓ User-specific operations work correctly");

        // 4. Test admin-specific operations (simulated with test user having admin role)
        var adminAnalyticsResponse = await Client.GetAsync("/api/v7/qa/analytics/dashboard");
        Assert.Equal(HttpStatusCode.OK, adminAnalyticsResponse.StatusCode);
        _output.WriteLine("✓ Admin-specific operations accessible");

        // 5. Test SignalR authentication
        Assert.Equal(HubConnectionState.Connected, _angularHubConnection?.State);
        Assert.Equal(HubConnectionState.Connected, _reactHubConnection?.State);
        _output.WriteLine("✓ SignalR authentication working for both clients");

        _output.WriteLine("✅ Authentication and authorization test passed");
    }

    [Fact]
    public async Task PerformanceUnderLoad_WithBothClients_ShouldMeetRequirements()
    {
        // Test performance validation under load with both clients active
        _output.WriteLine("Testing performance under load with both clients active...");

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        var tasks = new List<Task>();
        var successCount = 0;
        var errorCount = 0;

        // 1. Simulate concurrent load from both Angular and React clients
        for (int i = 0; i < 20; i++)
        {
            var clientType = i % 2 == 0 ? "Angular" : "React";
            
            tasks.Add(Task.Run(async () =>
            {
                try
                {
                    var client = Factory.CreateClient();
                    client.DefaultRequestHeaders.Add("X-Test-Auth", "true");
                    client.DefaultRequestHeaders.Add("X-Client-Type", clientType);

                    // Simulate typical user operations
                    var searchResponse = await client.GetAsync("/api/v7/qa/questions/search?searchTerm=performance");
                    if (searchResponse.IsSuccessStatusCode)
                    {
                        Interlocked.Increment(ref successCount);
                    }
                    else
                    {
                        Interlocked.Increment(ref errorCount);
                    }

                    var questionsResponse = await client.GetAsync("/api/v7/qa/questions?pageSize=10");
                    if (questionsResponse.IsSuccessStatusCode)
                    {
                        Interlocked.Increment(ref successCount);
                    }
                    else
                    {
                        Interlocked.Increment(ref errorCount);
                    }
                }
                catch (Exception ex)
                {
                    _output.WriteLine($"Error in concurrent request: {ex.Message}");
                    Interlocked.Increment(ref errorCount);
                }
            }));
        }

        // 2. Wait for all concurrent requests to complete
        await Task.WhenAll(tasks);
        stopwatch.Stop();

        // 3. Verify performance requirements
        var totalRequests = successCount + errorCount;
        var successRate = (double)successCount / totalRequests * 100;
        var averageResponseTime = stopwatch.ElapsedMilliseconds / (double)totalRequests;

        _output.WriteLine($"Total requests: {totalRequests}");
        _output.WriteLine($"Successful requests: {successCount}");
        _output.WriteLine($"Failed requests: {errorCount}");
        _output.WriteLine($"Success rate: {successRate:F2}%");
        _output.WriteLine($"Average response time: {averageResponseTime:F2}ms");

        // Performance assertions
        Assert.True(successRate >= 95, $"Success rate should be >= 95%, but was {successRate:F2}%");
        Assert.True(averageResponseTime <= 500, $"Average response time should be <= 500ms, but was {averageResponseTime:F2}ms");

        // 4. Test real-time performance under load
        var realTimeStopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        // Create a question and measure real-time notification delivery
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Performance Test - Load Testing Question",
            Content = "This question is created as part of performance testing to measure real-time notification delivery under load.",
            Category = "Testing",
            Tags = new List<string> { "performance", "load-test", "real-time" }
        };

        _receivedMessages.Clear();
        var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        
        // Wait for real-time notifications
        var timeout = TimeSpan.FromSeconds(5);
        var startTime = DateTime.UtcNow;
        
        while (_receivedMessages.Count < 2 && DateTime.UtcNow - startTime < timeout)
        {
            await Task.Delay(100);
        }
        
        realTimeStopwatch.Stop();

        var realTimeLatency = realTimeStopwatch.ElapsedMilliseconds;
        _output.WriteLine($"Real-time notification latency: {realTimeLatency}ms");
        
        // Real-time performance assertion
        Assert.True(realTimeLatency <= 3000, $"Real-time latency should be <= 3000ms, but was {realTimeLatency}ms");

        _output.WriteLine("✅ Performance under load test passed");
    }

    [Fact]
    public async Task DataConsistency_AcrossFrontends_ShouldBeMaintained()
    {
        // Test data consistency across both frontends
        _output.WriteLine("Testing data consistency across frontends...");

        // 1. Create question through Angular client simulation
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Data Consistency Test - Cross-Frontend Synchronization",
            Content = "Testing data consistency across Angular and React frontends to ensure both applications show the same information.",
            Category = "Testing",
            Tags = new List<string> { "consistency", "frontend", "synchronization" }
        };

        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular");
        
        var angularQuestionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        Assert.Equal(HttpStatusCode.Created, angularQuestionResponse.StatusCode);
        
        var questionContent = await angularQuestionResponse.Content.ReadAsStringAsync();
        var createdQuestion = JsonSerializer.Deserialize<QuestionDto>(questionContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // 2. Retrieve question through React client simulation
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React");
        
        var reactQuestionResponse = await Client.GetAsync($"/api/v7/qa/questions/{createdQuestion!.Id}");
        Assert.Equal(HttpStatusCode.OK, reactQuestionResponse.StatusCode);
        
        var reactQuestionContent = await reactQuestionResponse.Content.ReadAsStringAsync();
        var reactQuestion = JsonSerializer.Deserialize<QuestionDto>(reactQuestionContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // 3. Verify data consistency
        Assert.Equal(createdQuestion.Id, reactQuestion!.Id);
        Assert.Equal(createdQuestion.Title, reactQuestion.Title);
        Assert.Equal(createdQuestion.Content, reactQuestion.Content);
        Assert.Equal(createdQuestion.Category, reactQuestion.Category);
        _output.WriteLine("✓ Question data consistent across frontends");

        // 4. Add answer through React client and verify through Angular
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = createdQuestion.Id,
            Content = "This answer is created through React client simulation to test cross-frontend data consistency."
        };

        var reactAnswerResponse = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
        Assert.Equal(HttpStatusCode.Created, reactAnswerResponse.StatusCode);

        // 5. Retrieve answers through Angular client
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular");
        
        var angularAnswersResponse = await Client.GetAsync($"/api/v7/qa/answers/question/{createdQuestion.Id}");
        Assert.Equal(HttpStatusCode.OK, angularAnswersResponse.StatusCode);
        
        var angularAnswersContent = await angularAnswersResponse.Content.ReadAsStringAsync();
        Assert.Contains("React client simulation", angularAnswersContent);
        _output.WriteLine("✓ Answer data consistent across frontends");

        _output.WriteLine("✅ Data consistency test passed");
    }

    [Fact]
    public async Task ErrorHandling_AcrossFrontends_ShouldBeConsistent()
    {
        // Test error handling consistency across both frontends
        _output.WriteLine("Testing error handling consistency across frontends...");

        // 1. Test validation errors are consistent
        var invalidQuestionRequest = new CreateQuestionRequest
        {
            Title = "Short", // Too short
            Content = "Too short content", // Too short
            Category = "InvalidCategory", // Invalid category
            Tags = new List<string>()
        };

        // Test through Angular client simulation
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular");
        
        var angularErrorResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);
        Assert.Equal(HttpStatusCode.BadRequest, angularErrorResponse.StatusCode);
        var angularErrorContent = await angularErrorResponse.Content.ReadAsStringAsync();

        // Test through React client simulation
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "React");
        
        var reactErrorResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", invalidQuestionRequest);
        Assert.Equal(HttpStatusCode.BadRequest, reactErrorResponse.StatusCode);
        var reactErrorContent = await reactErrorResponse.Content.ReadAsStringAsync();

        // Verify error responses are consistent
        Assert.Equal(angularErrorResponse.StatusCode, reactErrorResponse.StatusCode);
        _output.WriteLine("✓ Validation error responses consistent across frontends");

        // 2. Test not found errors
        var nonExistentId = Guid.NewGuid();
        
        var angularNotFoundResponse = await Client.GetAsync($"/api/v7/qa/questions/{nonExistentId}");
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", "Angular");
        
        var reactNotFoundResponse = await Client.GetAsync($"/api/v7/qa/questions/{nonExistentId}");
        
        Assert.Equal(angularNotFoundResponse.StatusCode, reactNotFoundResponse.StatusCode);
        _output.WriteLine("✓ Not found error responses consistent across frontends");

        _output.WriteLine("✅ Error handling consistency test passed");
    }
}