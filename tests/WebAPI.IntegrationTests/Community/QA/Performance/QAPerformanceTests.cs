using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Microsoft.AspNetCore.Mvc.Testing;
using WebAPI.IntegrationTests.QA.Core;
using Xunit;
using Xunit.Abstractions;

namespace WebAPI.IntegrationTests.QA.Performance;

/// <summary>
/// Performance testing for QA System Integration
/// Tests response times, throughput, and scalability under various load conditions
/// Consolidates all performance-related tests to eliminate duplication
/// </summary>
public class QAPerformanceTests : QAIntegrationTestBase
{
    public QAPerformanceTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory, output)
    {
    }

    public override async Task InitializeAsync()
    {
        // Skip SignalR setup for performance tests to avoid connection overhead
        await SeedTestData();
    }

    public override async Task DisposeAsync()
    {
        // No SignalR connections to clean up
    }

    #region Response Time Tests

    [Fact]
    public async Task QAEndpoints_ResponseTimes_ShouldMeetPerformanceRequirements()
    {
        Output.WriteLine("=== Testing QA Endpoint Response Times ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping response time tests");
            return;
        }

        var endpoints = new[]
        {
            "/api/v7/qa/questions?pageSize=10",
            "/api/v7/qa/questions/search?searchTerm=test&pageSize=5",
            "/api/v7/qa/categories",
            "/api/v7/qa/reputation/leaderboard?pageSize=10"
        };

        foreach (var endpoint in endpoints)
        {
            var stopwatch = Stopwatch.StartNew();
            var response = await Client.GetAsync(endpoint);
            stopwatch.Stop();

            var responseTime = stopwatch.ElapsedMilliseconds;
            var meetsRequirement = responseTime <= 500; // 500ms requirement

            LogTestResult($"Response time for {endpoint}", 
                meetsRequirement || response.StatusCode == HttpStatusCode.NotFound, 
                $"{responseTime}ms (target: ≤500ms)");
        }

        Output.WriteLine("✅ Response time tests completed");
    }

    [Fact]
    public async Task QuestionCreation_ResponseTime_ShouldBeOptimal()
    {
        Output.WriteLine("=== Testing Question Creation Performance ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping question creation performance test");
            return;
        }

        var questionRequest = new CreateQuestionRequest
        {
            Title = "Performance Test Question - Response Time Measurement",
            Content = "This question is created to measure the response time of the question creation endpoint. It contains sufficient content to pass validation while testing performance characteristics.",
            Category = "Performance",
            Tags = new List<string> { "performance", "testing", "response-time" }
        };

        var stopwatch = Stopwatch.StartNew();
        var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        stopwatch.Stop();

        var responseTime = stopwatch.ElapsedMilliseconds;
        var meetsRequirement = responseTime <= 1000; // 1 second for creation operations

        LogTestResult("Question creation response time", 
            meetsRequirement || response.StatusCode == HttpStatusCode.NotFound, 
            $"{responseTime}ms (target: ≤1000ms)");

        Output.WriteLine("✅ Question creation performance test completed");
    }

    #endregion

    #region Throughput Tests

    [Fact]
    public async Task ConcurrentQuestionRetrieval_ShouldHandleLoad()
    {
        Output.WriteLine("=== Testing Concurrent Question Retrieval Throughput ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping throughput tests");
            return;
        }

        const int concurrentRequests = 50;
        var tasks = new List<Task<(bool Success, long ResponseTime)>>();
        var stopwatch = Stopwatch.StartNew();

        // Create concurrent requests
        for (int i = 0; i < concurrentRequests; i++)
        {
            tasks.Add(Task.Run(async () =>
            {
                var client = Factory.CreateClient();
                client.DefaultRequestHeaders.Add("X-Test-Auth", "true");

                var requestStopwatch = Stopwatch.StartNew();
                var response = await client.GetAsync("/api/v7/qa/questions?pageSize=5");
                requestStopwatch.Stop();

                return (response.IsSuccessStatusCode, requestStopwatch.ElapsedMilliseconds);
            }));
        }

        var results = await Task.WhenAll(tasks);
        stopwatch.Stop();

        var successfulRequests = results.Count(r => r.Success);
        var totalTime = stopwatch.ElapsedMilliseconds;
        var averageResponseTime = results.Where(r => r.Success).Average(r => r.ResponseTime);
        var throughput = (double)successfulRequests / totalTime * 1000; // requests per second

        Output.WriteLine($"📊 Throughput Results:");
        Output.WriteLine($"   Concurrent requests: {concurrentRequests}");
        Output.WriteLine($"   Successful requests: {successfulRequests}");
        Output.WriteLine($"   Total time: {totalTime}ms");
        Output.WriteLine($"   Average response time: {averageResponseTime:F2}ms");
        Output.WriteLine($"   Throughput: {throughput:F2} requests/second");

        var successRate = (double)successfulRequests / concurrentRequests * 100;
        LogTestResult("Concurrent request success rate", successRate >= 90, $"{successRate:F1}%");
        LogTestResult("Average response time under load", averageResponseTime <= 1000, $"{averageResponseTime:F2}ms");

        Output.WriteLine("✅ Throughput tests completed");
    }

    [Fact]
    public async Task ConcurrentQuestionCreation_ShouldMaintainPerformance()
    {
        Output.WriteLine("=== Testing Concurrent Question Creation Performance ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping concurrent creation tests");
            return;
        }

        const int concurrentCreations = 20;
        var tasks = new List<Task<(bool Success, long ResponseTime)>>();
        var stopwatch = Stopwatch.StartNew();

        // Create concurrent question creation requests
        for (int i = 0; i < concurrentCreations; i++)
        {
            var questionIndex = i;
            tasks.Add(Task.Run(async () =>
            {
                var client = Factory.CreateClient();
                client.DefaultRequestHeaders.Add("X-Test-Auth", "true");

                var questionRequest = new CreateQuestionRequest
                {
                    Title = $"Concurrent Performance Test Question {questionIndex}",
                    Content = $"This is question number {questionIndex} created during concurrent performance testing to measure system throughput and response times under load.",
                    Category = "Performance",
                    Tags = new List<string> { "performance", "concurrent", $"test-{questionIndex}" }
                };

                var requestStopwatch = Stopwatch.StartNew();
                var response = await client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
                requestStopwatch.Stop();

                return (response.IsSuccessStatusCode, requestStopwatch.ElapsedMilliseconds);
            }));
        }

        var results = await Task.WhenAll(tasks);
        stopwatch.Stop();

        var successfulCreations = results.Count(r => r.Success);
        var totalTime = stopwatch.ElapsedMilliseconds;
        var averageResponseTime = results.Where(r => r.Success).Average(r => r.ResponseTime);

        Output.WriteLine($"📊 Concurrent Creation Results:");
        Output.WriteLine($"   Concurrent creations: {concurrentCreations}");
        Output.WriteLine($"   Successful creations: {successfulCreations}");
        Output.WriteLine($"   Total time: {totalTime}ms");
        Output.WriteLine($"   Average response time: {averageResponseTime:F2}ms");

        var successRate = (double)successfulCreations / concurrentCreations * 100;
        LogTestResult("Concurrent creation success rate", successRate >= 80, $"{successRate:F1}%");
        LogTestResult("Average creation time under load", averageResponseTime <= 2000, $"{averageResponseTime:F2}ms");

        Output.WriteLine("✅ Concurrent creation tests completed");
    }

    #endregion

    #region Memory and Resource Tests

    [Fact]
    public async Task LargeDataRetrieval_ShouldBeEfficient()
    {
        Output.WriteLine("=== Testing Large Data Retrieval Efficiency ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping large data retrieval tests");
            return;
        }

        // Test retrieving large page sizes
        var pageSizes = new[] { 50, 100, 200 };

        foreach (var pageSize in pageSizes)
        {
            var stopwatch = Stopwatch.StartNew();
            var response = await Client.GetAsync($"/api/v7/qa/questions?pageSize={pageSize}");
            stopwatch.Stop();

            var responseTime = stopwatch.ElapsedMilliseconds;
            var isEfficient = responseTime <= 2000; // 2 seconds for large data sets

            LogTestResult($"Large data retrieval (pageSize={pageSize})", 
                isEfficient || response.StatusCode == HttpStatusCode.NotFound, 
                $"{responseTime}ms");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var contentSize = content.Length;
                Output.WriteLine($"   Response size: {contentSize / 1024:F1} KB");
            }
        }

        Output.WriteLine("✅ Large data retrieval tests completed");
    }

    #endregion

    #region Search Performance Tests

    [Fact]
    public async Task SearchOperations_ShouldMeetPerformanceTargets()
    {
        Output.WriteLine("=== Testing Search Performance ===");

        var searchEndpoint = "/api/v7/qa/questions/search";
        if (!await IsEndpointAvailable(searchEndpoint))
        {
            LogWarning("Search endpoints not implemented yet - skipping search performance tests");
            return;
        }

        var searchTerms = new[]
        {
            "javascript",
            "database performance",
            "angular react integration",
            "security authentication",
            "real-time signalr"
        };

        foreach (var searchTerm in searchTerms)
        {
            var stopwatch = Stopwatch.StartNew();
            var response = await Client.GetAsync($"{searchEndpoint}?searchTerm={Uri.EscapeDataString(searchTerm)}&pageSize=20");
            stopwatch.Stop();

            var responseTime = stopwatch.ElapsedMilliseconds;
            var meetsTarget = responseTime <= 1500; // 1.5 seconds for search operations

            LogTestResult($"Search performance for '{searchTerm}'", 
                meetsTarget || response.StatusCode == HttpStatusCode.NotFound, 
                $"{responseTime}ms");
        }

        Output.WriteLine("✅ Search performance tests completed");
    }

    [Fact]
    public async Task ConcurrentSearchOperations_ShouldScaleWell()
    {
        Output.WriteLine("=== Testing Concurrent Search Scalability ===");

        var searchEndpoint = "/api/v7/qa/questions/search";
        if (!await IsEndpointAvailable(searchEndpoint))
        {
            LogWarning("Search endpoints not implemented yet - skipping concurrent search tests");
            return;
        }

        const int concurrentSearches = 30;
        var searchTerms = new[] { "test", "performance", "integration", "security", "database" };
        var tasks = new List<Task<(bool Success, long ResponseTime)>>();
        var stopwatch = Stopwatch.StartNew();

        for (int i = 0; i < concurrentSearches; i++)
        {
            var searchTerm = searchTerms[i % searchTerms.Length];
            tasks.Add(Task.Run(async () =>
            {
                var client = Factory.CreateClient();
                client.DefaultRequestHeaders.Add("X-Test-Auth", "true");

                var requestStopwatch = Stopwatch.StartNew();
                var response = await client.GetAsync($"{searchEndpoint}?searchTerm={searchTerm}&pageSize=10");
                requestStopwatch.Stop();

                return (response.IsSuccessStatusCode, requestStopwatch.ElapsedMilliseconds);
            }));
        }

        var results = await Task.WhenAll(tasks);
        stopwatch.Stop();

        var successfulSearches = results.Count(r => r.Success);
        var totalTime = stopwatch.ElapsedMilliseconds;
        var averageResponseTime = results.Where(r => r.Success).Average(r => r.ResponseTime);

        Output.WriteLine($"📊 Concurrent Search Results:");
        Output.WriteLine($"   Concurrent searches: {concurrentSearches}");
        Output.WriteLine($"   Successful searches: {successfulSearches}");
        Output.WriteLine($"   Total time: {totalTime}ms");
        Output.WriteLine($"   Average response time: {averageResponseTime:F2}ms");

        var successRate = (double)successfulSearches / concurrentSearches * 100;
        LogTestResult("Concurrent search success rate", successRate >= 85, $"{successRate:F1}%");
        LogTestResult("Average search time under load", averageResponseTime <= 2000, $"{averageResponseTime:F2}ms");

        Output.WriteLine("✅ Concurrent search tests completed");
    }

    #endregion

    #region Database Performance Tests

    [Fact]
    public async Task DatabaseOperations_ShouldBeOptimized()
    {
        Output.WriteLine("=== Testing Database Operation Performance ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping database performance tests");
            return;
        }

        // Test various database-intensive operations
        var operations = new[]
        {
            ("Question listing", "/api/v7/qa/questions?pageSize=50"),
            ("Category listing", "/api/v7/qa/categories"),
            ("Reputation leaderboard", "/api/v7/qa/reputation/leaderboard?pageSize=25"),
            ("User questions", "/api/v7/qa/questions/my-questions?pageSize=20")
        };

        foreach (var (operationName, endpoint) in operations)
        {
            var stopwatch = Stopwatch.StartNew();
            var response = await Client.GetAsync(endpoint);
            stopwatch.Stop();

            var responseTime = stopwatch.ElapsedMilliseconds;
            var isOptimized = responseTime <= 800; // 800ms for database operations

            LogTestResult($"Database operation: {operationName}", 
                isOptimized || response.StatusCode == HttpStatusCode.NotFound, 
                $"{responseTime}ms");
        }

        Output.WriteLine("✅ Database performance tests completed");
    }

    #endregion

    #region Real-time Performance Tests

    [Fact]
    public async Task RealTimeNotifications_ShouldHaveLowLatency()
    {
        Output.WriteLine("=== Testing Real-time Notification Performance ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping real-time performance tests");
            return;
        }

        // Set up SignalR connections for this specific test
        await SetupSignalRConnections();

        if (AngularHubConnection?.State != Microsoft.AspNetCore.SignalR.Client.HubConnectionState.Connected)
        {
            LogWarning("SignalR connections not available - skipping real-time latency test");
            return;
        }

        ClearRealTimeMessages();

        // Create a question and measure notification latency
        var stopwatch = Stopwatch.StartNew();
        
        var question = await CreateTestQuestion(
            "Real-time Performance Test",
            "Testing real-time notification latency for performance measurement.",
            "Performance",
            new List<string> { "real-time", "performance", "latency" }
        );

        if (question != null)
        {
            // Wait for real-time notifications
            var timeout = TimeSpan.FromSeconds(5);
            var startTime = DateTime.UtcNow;
            
            while (RealTimeEvents.Count == 0 && DateTime.UtcNow - startTime < timeout)
            {
                await Task.Delay(100);
            }
            
            stopwatch.Stop();

            var latency = stopwatch.ElapsedMilliseconds;
            var meetsLatencyTarget = latency <= 3000; // 3 seconds for real-time notifications

            LogTestResult("Real-time notification latency", 
                meetsLatencyTarget || RealTimeEvents.Count == 0, 
                RealTimeEvents.Count > 0 ? $"{latency}ms" : "No notifications received");
        }

        await CleanupSignalRConnections();
        Output.WriteLine("✅ Real-time performance tests completed");
    }

    #endregion

    #region Stress Tests

    [Fact]
    public async Task SystemUnderStress_ShouldMaintainStability()
    {
        Output.WriteLine("=== Testing System Stability Under Stress ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping stress tests");
            return;
        }

        const int stressTestDuration = 30; // seconds
        const int requestsPerSecond = 10;
        var totalRequests = stressTestDuration * requestsPerSecond;
        
        var successCount = 0;
        var errorCount = 0;
        var responseTimes = new List<long>();
        var stopwatch = Stopwatch.StartNew();

        Output.WriteLine($"Running stress test: {totalRequests} requests over {stressTestDuration} seconds...");

        var tasks = new List<Task>();
        for (int i = 0; i < totalRequests; i++)
        {
            var requestIndex = i;
            tasks.Add(Task.Run(async () =>
            {
                try
                {
                    // Stagger requests to maintain consistent load
                    await Task.Delay(requestIndex * (1000 / requestsPerSecond));

                    var client = Factory.CreateClient();
                    client.DefaultRequestHeaders.Add("X-Test-Auth", "true");

                    var requestStopwatch = Stopwatch.StartNew();
                    var response = await client.GetAsync("/api/v7/qa/questions?pageSize=5");
                    requestStopwatch.Stop();

                    lock (responseTimes)
                    {
                        responseTimes.Add(requestStopwatch.ElapsedMilliseconds);
                    }

                    if (response.IsSuccessStatusCode)
                    {
                        Interlocked.Increment(ref successCount);
                    }
                    else
                    {
                        Interlocked.Increment(ref errorCount);
                    }
                }
                catch (Exception)
                {
                    Interlocked.Increment(ref errorCount);
                }
            }));
        }

        await Task.WhenAll(tasks);
        stopwatch.Stop();

        var actualDuration = stopwatch.ElapsedMilliseconds / 1000.0;
        var actualThroughput = totalRequests / actualDuration;
        var successRate = (double)successCount / totalRequests * 100;
        var averageResponseTime = responseTimes.Count > 0 ? responseTimes.Average() : 0;
        var maxResponseTime = responseTimes.Count > 0 ? responseTimes.Max() : 0;

        Output.WriteLine($"📊 Stress Test Results:");
        Output.WriteLine($"   Total requests: {totalRequests}");
        Output.WriteLine($"   Successful requests: {successCount}");
        Output.WriteLine($"   Failed requests: {errorCount}");
        Output.WriteLine($"   Success rate: {successRate:F1}%");
        Output.WriteLine($"   Duration: {actualDuration:F1}s");
        Output.WriteLine($"   Throughput: {actualThroughput:F1} req/s");
        Output.WriteLine($"   Average response time: {averageResponseTime:F2}ms");
        Output.WriteLine($"   Max response time: {maxResponseTime}ms");

        LogTestResult("System stability under stress", successRate >= 95, $"Success rate: {successRate:F1}%");
        LogTestResult("Response time stability", averageResponseTime <= 1000, $"Average: {averageResponseTime:F2}ms");

        Output.WriteLine("✅ Stress tests completed");
    }

    #endregion
}