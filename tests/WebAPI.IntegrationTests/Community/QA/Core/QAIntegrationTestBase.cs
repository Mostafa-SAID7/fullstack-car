using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using WebAPI.IntegrationTests.Core;
using Xunit;
using Xunit.Abstractions;

namespace WebAPI.IntegrationTests.QA.Core;

/// <summary>
/// Base class for all QA integration tests
/// Provides common functionality and eliminates duplication across test classes
/// </summary>
public abstract class QAIntegrationTestBase : BaseIntegrationTest, IAsyncLifetime
{
    protected readonly ITestOutputHelper Output;
    protected HubConnection? AngularHubConnection;
    protected HubConnection? ReactHubConnection;
    protected readonly List<string> AngularMessages = new();
    protected readonly List<string> ReactMessages = new();
    protected readonly List<string> RealTimeEvents = new();

    protected QAIntegrationTestBase(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory)
    {
        Output = output;
    }

    public virtual async Task InitializeAsync()
    {
        await SetupSignalRConnections();
        await SeedTestData();
    }

    public virtual async Task DisposeAsync()
    {
        await CleanupSignalRConnections();
    }

    #region SignalR Setup and Management

    protected virtual async Task SetupSignalRConnections()
    {
        try
        {
            var baseUrl = Client.BaseAddress?.ToString().TrimEnd('/') ?? "http://localhost";
            
            // Angular Main App SignalR Connection
            AngularHubConnection = new HubConnectionBuilder()
                .WithUrl($"{baseUrl}/hubs/qa", options =>
                {
                    options.Headers.Add("X-Test-Auth", "true");
                    options.Headers.Add("X-Client-Type", "Angular");
                    options.HttpMessageHandlerFactory = _ => Factory.Server.CreateHandler();
                })
                .Build();

            // React Dashboard SignalR Connection  
            ReactHubConnection = new HubConnectionBuilder()
                .WithUrl($"{baseUrl}/hubs/qa", options =>
                {
                    options.Headers.Add("X-Test-Auth", "true");
                    options.Headers.Add("X-Client-Type", "React");
                    options.HttpMessageHandlerFactory = _ => Factory.Server.CreateHandler();
                })
                .Build();

            SetupSignalREventHandlers();

            await AngularHubConnection.StartAsync();
            await ReactHubConnection.StartAsync();
            
            // Wait for connections to be established
            await Task.Delay(1000);
            
            Output.WriteLine($"SignalR connections established - Angular: {AngularHubConnection.State}, React: {ReactHubConnection.State}");
        }
        catch (Exception ex)
        {
            Output.WriteLine($"SignalR connection setup failed: {ex.Message}");
            // Don't fail tests if SignalR is not available
        }
    }

    protected virtual void SetupSignalREventHandlers()
    {
        if (AngularHubConnection != null)
        {
            AngularHubConnection.On<QuestionDto>("ReceiveQuestionUpdate", question =>
            {
                var message = $"Angular: Question update - {question.Title}";
                AngularMessages.Add(message);
                RealTimeEvents.Add($"Angular-QuestionUpdate-{DateTime.UtcNow:HH:mm:ss.fff}");
                Output.WriteLine(message);
            });

            AngularHubConnection.On<AnswerDto>("ReceiveNewAnswer", answer =>
            {
                var message = $"Angular: New answer - {answer.Content.Substring(0, Math.Min(50, answer.Content.Length))}...";
                AngularMessages.Add(message);
                RealTimeEvents.Add($"Angular-NewAnswer-{DateTime.UtcNow:HH:mm:ss.fff}");
                Output.WriteLine(message);
            });

            AngularHubConnection.On<VoteUpdateDto>("ReceiveVoteUpdate", voteUpdate =>
            {
                var message = $"Angular: Vote update - {voteUpdate.ContentType} {voteUpdate.VoteType}";
                AngularMessages.Add(message);
                RealTimeEvents.Add($"Angular-VoteUpdate-{DateTime.UtcNow:HH:mm:ss.fff}");
                Output.WriteLine(message);
            });
        }

        if (ReactHubConnection != null)
        {
            ReactHubConnection.On<QuestionDto>("ReceiveQuestionUpdate", question =>
            {
                var message = $"React: Question update - {question.Title}";
                ReactMessages.Add(message);
                RealTimeEvents.Add($"React-QuestionUpdate-{DateTime.UtcNow:HH:mm:ss.fff}");
                Output.WriteLine(message);
            });

            ReactHubConnection.On<AnswerDto>("ReceiveNewAnswer", answer =>
            {
                var message = $"React: New answer - {answer.Content.Substring(0, Math.Min(50, answer.Content.Length))}...";
                ReactMessages.Add(message);
                RealTimeEvents.Add($"React-NewAnswer-{DateTime.UtcNow:HH:mm:ss.fff}");
                Output.WriteLine(message);
            });

            ReactHubConnection.On<VoteUpdateDto>("ReceiveVoteUpdate", voteUpdate =>
            {
                var message = $"React: Vote update - {voteUpdate.ContentType} {voteUpdate.VoteType}";
                ReactMessages.Add(message);
                RealTimeEvents.Add($"React-VoteUpdate-{DateTime.UtcNow:HH:mm:ss.fff}");
                Output.WriteLine(message);
            });
        }
    }

    protected virtual async Task CleanupSignalRConnections()
    {
        if (AngularHubConnection != null)
        {
            await AngularHubConnection.DisposeAsync();
            AngularHubConnection = null;
        }

        if (ReactHubConnection != null)
        {
            await ReactHubConnection.DisposeAsync();
            ReactHubConnection = null;
        }
    }

    #endregion

    #region Test Data Management

    protected virtual async Task SeedTestData()
    {
        using var scope = Factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        var categoryCount = await context.QACategories.CountAsync();
        Output.WriteLine($"QA Categories available: {categoryCount}");
    }

    protected virtual void ClearRealTimeMessages()
    {
        AngularMessages.Clear();
        ReactMessages.Clear();
        RealTimeEvents.Clear();
    }

    #endregion

    #region Common Test Helpers

    protected async Task<QuestionDto?> CreateTestQuestion(string title, string content, string category = "Testing", List<string>? tags = null)
    {
        var questionRequest = new CreateQuestionRequest
        {
            Title = title,
            Content = content,
            Category = category,
            Tags = tags ?? new List<string> { "test" }
        };

        var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
        
        if (response.StatusCode == HttpStatusCode.Created)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            return DeserializeApiResponseData<QuestionDto>(responseContent);
        }

        return null;
    }

    protected async Task<AnswerDto?> CreateTestAnswer(Guid questionId, string content)
    {
        var answerRequest = new CreateAnswerRequest
        {
            QuestionId = questionId,
            Content = content
        };

        var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
        
        if (response.StatusCode == HttpStatusCode.Created)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            return DeserializeApiResponseData<AnswerDto>(responseContent);
        }

        return null;
    }

    protected async Task<bool> CreateTestVote(Guid contentId, string contentType, string voteType)
    {
        var voteRequest = new CreateVoteRequest
        {
            ContentId = contentId,
            ContentType = contentType,
            VoteType = voteType
        };

        var response = await Client.PostAsJsonAsync("/api/v7/qa/votes", voteRequest);
        return response.IsSuccessStatusCode;
    }

    protected void SetClientType(string clientType)
    {
        Client.DefaultRequestHeaders.Remove("X-Client-Type");
        Client.DefaultRequestHeaders.Add("X-Client-Type", clientType);
    }

    protected async Task<bool> IsEndpointAvailable(string endpoint)
    {
        var response = await Client.GetAsync(endpoint);
        return response.StatusCode != HttpStatusCode.NotFound;
    }

    protected void LogTestResult(string testName, bool success, string? message = null)
    {
        var status = success ? "✅" : "❌";
        var fullMessage = message != null ? $" - {message}" : "";
        Output.WriteLine($"{status} {testName}{fullMessage}");
    }

    protected void LogWarning(string message)
    {
        Output.WriteLine($"⚠️  {message}");
    }

    protected void LogInfo(string message)
    {
        Output.WriteLine($"ℹ️  {message}");
    }

    #endregion
}