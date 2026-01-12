using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Xunit;
using Xunit.Abstractions;

namespace WebAPI.IntegrationTests;

/// <summary>
/// Performance and load testing for QA System across both frontends
/// Tests system performance under concurrent load from Angular and React clients
/// Validates Requirements: Performance requirements under load
/// </summary>
public class QAPerformanceLoadTests : BaseIntegrationTest
{
    private readonly ITestOutputHelper _output;

    public QAPerformanceLoadTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory)
    {
        _output = output;
    }

    [Fact]
    public async Task HighVolumeQuestionCreation_ShouldMaintainPerformance()
    {
        _output.WriteLine("🚀 Starting high volume question creation test...");

        const int totalQuestions = 50;
        const int concurrentBatches = 5;
        const int questionsPerBatch = totalQuestions / concurrentBatches;

        var stopwatch = Stopwatch.StartNew();
        var successfulCreations = 0;
        var failedCreations = 0;

        var tasks = new List<Task>();

        for (int batch = 0; batch < concurrentBatches; batch++)
        {
            var batchIndex = batch;
            tasks.Add(Task.Run(async () =>
            {
                using var client = Factory.CreateClient();
                client.DefaultRequestHeaders.Authorization = 
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TestAuthToken);

                for (int i = 0; i < questionsPerBatch; i++)
                {
                    try
                    {
                        var questionRequest = new CreateQuestionRequest
                        {
                            Title = $"Load Test Question {batchIndex}-{i}",
                            Content = $"This is a performance test question from batch {batchIndex}, question {i}",
                            Category = "Performance Testing",
                            Tags = new List<string> { "load-test", "performance", $"batch-{batchIndex}" }
                        };

                        var response = await client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
                        
                        if (response.IsSuccessStatusCode)
                        {
                            Interlocked.Increment(ref successfulCreations);
                        }
                        else
                        {
                            Interlocked.Increment(ref failedCreations);
                        }
                    }
                    catch
                    {
                        Interlocked.Increment(ref failedCreations);
                    }
                }
            }));
        }

        await Task.WhenAll(tasks);
        stopwatch.Stop();

        var totalTime = stopwatch.ElapsedMilliseconds;
        var averageTimePerQuestion = (double)totalTime / totalQuestions;
        var questionsPerSecond = (double)totalQuestions / (totalTime / 1000.0);

        _output.WriteLine($"✓ Created {successfulCreations} questions successfully");
        _output.WriteLine($"✗ Failed to create {failedCreations} questions");
        _output.WriteLine($"⏱️ Total time: {totalTime}ms");
        _output.WriteLine($"📊 Average time per question: {averageTimePerQuestion:F2}ms");
        _output.WriteLine($"🚄 Questions per second: {questionsPerSecond:F2}");

        // Performance assertions
        Assert.True(successfulCreations >= (totalQuestions * 0.9), 
            $"Expected at least 90% success rate, got {(double)successfulCreations / totalQuestions * 100:F1}%");
        
        Assert.True(averageTimePerQuestion < 1000, 
            $"Expected average time per question < 1000ms, got {averageTimePerQuestion:F2}ms");

        _output.WriteLine("🎉 High volume question creation test completed!");
    }

    [Fact]
    public async Task ConcurrentVoting_ShouldHandleHighLoad()
    {
        _output.WriteLine("🗳️ Starting concurrent voting load test...");

        // First create a question to vote on
        var questionRequest = new CreateQuestionRequest
        {
            Title = "Voting Load Test Question",
            Content = "This question will receive many concurrent votes",
            Category = "Load Testing",
            Tags = new List<string> { "voting", "load-test" }
        };

        var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        Assert.True(questionResponse.IsSuccessStatusCode);

        var questionContent = await questionResponse.Content.ReadAsStringAsync();
        var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
        var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

        const int concurrentVotes = 30;
        var successfulVotes = 0;
        var failedVotes = 0;

        var stopwatch = Stopwatch.StartNew();

        var votingTasks = new List<Task>();

        for (int i = 0; i < concurrentVotes; i++)
        {
            var voteIndex = i;
            votingTasks.Add(Task.Run(async () =>
            {
                try
                {
                    using var client = Factory.CreateClient();
                    client.DefaultRequestHeaders.Authorization = 
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TestAuthToken);

                    var voteRequest = new CreateVoteRequest
                    {
                        ContentId = questionId,
                        ContentType = "Question",
                        VoteType = voteIndex % 2 == 0 ? "Up" : "Down"
                    };

                    var response = await client.PostAsJsonAsync("/api/v7/qa/voting", voteRequest);
                    
                    if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.Conflict)
                    {
                        // Conflict is expected for duplicate votes from same user
                        Interlocked.Increment(ref successfulVotes);
                    }
                    else
                    {
                        Interlocked.Increment(ref failedVotes);
                    }
                }
                catch
                {
                    Interlocked.Increment(ref failedVotes);
                }
            }));
        }

        await Task.WhenAll(votingTasks);
        stopwatch.Stop();

        var totalTime = stopwatch.ElapsedMilliseconds;
        var averageTimePerVote = (double)totalTime / concurrentVotes;

        _output.WriteLine($"✓ Processed {successfulVotes} votes successfully");
        _output.WriteLine($"✗ Failed to process {failedVotes} votes");
        _output.WriteLine($"⏱️ Total time: {totalTime}ms");
        _output.WriteLine($"📊 Average time per vote: {averageTimePerVote:F2}ms");

        // Performance assertions
        Assert.True(successfulVotes >= (concurrentVotes * 0.8), 
            $"Expected at least 80% success rate, got {(double)successfulVotes / concurrentVotes * 100:F1}%");
        
        Assert.True(averageTimePerVote < 500, 
            $"Expected average time per vote < 500ms, got {averageTimePerVote:F2}ms");

        _output.WriteLine("🎉 Concurrent voting load test completed!");
    }

    [Fact]
    public async Task SearchPerformance_ShouldHandleConcurrentQueries()
    {
        _output.WriteLine("🔍 Starting search performance test...");

        // First create some questions to search for
        await CreateTestQuestionsForSearch();

        const int concurrentSearches = 25;
        var searchTerms = new[]
        {
            "javascript",
            "react",
            "angular",
            "performance",
            "database",
            "api",
            "testing",
            "security",
            "optimization",
            "integration"
        };

        var successfulSearches = 0;
        var failedSearches = 0;
        var searchTimes = new ConcurrentBag<long>();

        var searchTasks = new List<Task>();

        for (int i = 0; i < concurrentSearches; i++)
        {
            var searchIndex = i;
            searchTasks.Add(Task.Run(async () =>
            {
                try
                {
                    using var client = Factory.CreateClient();
                    client.DefaultRequestHeaders.Authorization = 
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TestAuthToken);

                    var searchTerm = searchTerms[searchIndex % searchTerms.Length];
                    var searchStopwatch = Stopwatch.StartNew();

                    var response = await client.GetAsync($"/api/v7/qa/questions/search?searchTerm={searchTerm}");
                    
                    searchStopwatch.Stop();
                    searchTimes.Add(searchStopwatch.ElapsedMilliseconds);

                    if (response.IsSuccessStatusCode)
                    {
                        Interlocked.Increment(ref successfulSearches);
                    }
                    else
                    {
                        Interlocked.Increment(ref failedSearches);
                    }
                }
                catch
                {
                    Interlocked.Increment(ref failedSearches);
                }
            }));
        }

        await Task.WhenAll(searchTasks);

        var averageSearchTime = searchTimes.Any() ? searchTimes.Average() : 0;
        var maxSearchTime = searchTimes.Any() ? searchTimes.Max() : 0;

        _output.WriteLine($"✓ Completed {successfulSearches} searches successfully");
        _output.WriteLine($"✗ Failed {failedSearches} searches");
        _output.WriteLine($"📊 Average search time: {averageSearchTime:F2}ms");
        _output.WriteLine($"⏱️ Max search time: {maxSearchTime}ms");

        // Performance assertions
        Assert.True(successfulSearches >= (concurrentSearches * 0.9), 
            $"Expected at least 90% success rate, got {(double)successfulSearches / concurrentSearches * 100:F1}%");
        
        Assert.True(averageSearchTime < 2000, 
            $"Expected average search time < 2000ms, got {averageSearchTime:F2}ms");

        _output.WriteLine("🎉 Search performance test completed!");
    }

    [Fact]
    public async Task SignalRConnectionLoad_ShouldHandleMultipleConnections()
    {
        _output.WriteLine("📡 Starting SignalR connection load test...");

        const int concurrentConnections = 20;
        var connections = new List<HubConnection>();
        var connectionTasks = new List<Task>();

        try
        {
            var hubUrl = Factory.Server.BaseAddress + "hubs/qa";

            // Create multiple concurrent connections
            for (int i = 0; i < concurrentConnections; i++)
            {
                var connectionIndex = i;
                connectionTasks.Add(Task.Run(async () =>
                {
                    var connection = new HubConnectionBuilder()
                        .WithUrl(hubUrl, options =>
                        {
                            options.Headers.Add("Authorization", $"Bearer {TestAuthToken}");
                            options.Headers.Add("X-Client-Type", connectionIndex % 2 == 0 ? "Angular-Main" : "React-Dashboard");
                        })
                        .Build();

                    await connection.StartAsync();
                    connections.Add(connection);

                    _output.WriteLine($"✓ Connection {connectionIndex} established");
                }));
            }

            var stopwatch = Stopwatch.StartNew();
            await Task.WhenAll(connectionTasks);
            stopwatch.Stop();

            _output.WriteLine($"✓ Established {connections.Count} SignalR connections in {stopwatch.ElapsedMilliseconds}ms");

            // Test broadcasting to all connections
            var messagesReceived = 0;
            var messageReceivedTasks = new List<TaskCompletionSource<bool>>();

            foreach (var connection in connections)
            {
                var tcs = new TaskCompletionSource<bool>();
                messageReceivedTasks.Add(tcs);

                connection.On<object>("QuestionCreated", (question) =>
                {
                    Interlocked.Increment(ref messagesReceived);
                    tcs.SetResult(true);
                });
            }

            // Create a question to trigger broadcast
            var questionRequest = new CreateQuestionRequest
            {
                Title = "SignalR Load Test Question",
                Content = "This question tests SignalR broadcasting under load",
                Category = "Load Testing",
                Tags = new List<string> { "signalr", "load-test" }
            };

            await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);

            // Wait for all connections to receive the message (with timeout)
            var timeout = Task.Delay(5000);
            var allMessagesReceived = Task.WhenAll(messageReceivedTasks.Select(tcs => tcs.Task));

            var completedTask = await Task.WhenAny(allMessagesReceived, timeout);

            if (completedTask == allMessagesReceived)
            {
                _output.WriteLine($"✓ All {connections.Count} connections received the broadcast message");
            }
            else
            {
                _output.WriteLine($"⚠️ Only {messagesReceived} out of {connections.Count} connections received the message within timeout");
            }

            // Performance assertions
            Assert.True(connections.Count >= (concurrentConnections * 0.9), 
                $"Expected at least 90% of connections to be established");
            
            Assert.True(messagesReceived >= (connections.Count * 0.8), 
                $"Expected at least 80% of connections to receive broadcast messages");

            _output.WriteLine("🎉 SignalR connection load test completed!");
        }
        finally
        {
            // Cleanup connections
            var cleanupTasks = connections.Select(async connection =>
            {
                try
                {
                    await connection.DisposeAsync();
                }
                catch
                {
                    // Ignore cleanup errors
                }
            });

            await Task.WhenAll(cleanupTasks);
            _output.WriteLine("✓ All SignalR connections cleaned up");
        }
    }

    private async Task CreateTestQuestionsForSearch()
    {
        var testQuestions = new[]
        {
            new CreateQuestionRequest
            {
                Title = "JavaScript Performance Optimization",
                Content = "How to optimize JavaScript performance in large applications",
                Category = "Web Development",
                Tags = new List<string> { "javascript", "performance", "optimization" }
            },
            new CreateQuestionRequest
            {
                Title = "React vs Angular Comparison",
                Content = "What are the key differences between React and Angular frameworks",
                Category = "Frontend",
                Tags = new List<string> { "react", "angular", "comparison" }
            },
            new CreateQuestionRequest
            {
                Title = "Database Query Optimization",
                Content = "Best practices for optimizing database queries",
                Category = "Database",
                Tags = new List<string> { "database", "sql", "optimization" }
            },
            new CreateQuestionRequest
            {
                Title = "API Security Best Practices",
                Content = "How to secure REST APIs effectively",
                Category = "Security",
                Tags = new List<string> { "api", "security", "rest" }
            },
            new CreateQuestionRequest
            {
                Title = "Integration Testing Strategies",
                Content = "Effective strategies for integration testing",
                Category = "Testing",
                Tags = new List<string> { "testing", "integration", "automation" }
            }
        };

        var creationTasks = testQuestions.Select(async question =>
        {
            using var client = Factory.CreateClient();
            client.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TestAuthToken);
            
            await client.PostAsJsonAsync("/api/v7/qa/questions", question);
        });

        await Task.WhenAll(creationTasks);
        _output.WriteLine("✓ Created test questions for search performance testing");
    }
}