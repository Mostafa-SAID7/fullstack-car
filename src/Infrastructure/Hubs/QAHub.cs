using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Infrastructure.Hubs;

/// <summary>
/// Unified SignalR Hub for QA system real-time communication
/// Serves both Angular Main App and React Dashboard clients
/// Provides real-time updates for questions, answers, votes, and expert notifications
/// </summary>
[Authorize]
public class QAHub : Hub<IQAHub>
{
    private readonly ILogger<QAHub> _logger;

    public QAHub(ILogger<QAHub> logger)
    {
        _logger = logger;
    }

    #region Connection Management

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";
        
        if (!string.IsNullOrEmpty(userId))
        {
            // Add user to their personal group for direct notifications
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            
            _logger.LogInformation("QA Hub: User {UserName} ({UserId}) connected with connection {ConnectionId}", 
                userName, userId, Context.ConnectionId);
        }
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            
            _logger.LogInformation("QA Hub: User {UserName} ({UserId}) disconnected from connection {ConnectionId}", 
                userName, userId, Context.ConnectionId);
        }
        
        if (exception != null)
        {
            _logger.LogError(exception, "QA Hub: User {UserName} disconnected with error", userName);
        }
        
        await base.OnDisconnectedAsync(exception);
    }

    #endregion

    #region Question Management

    /// <summary>
    /// Join a specific question's group to receive real-time updates
    /// Used when users view a question detail page
    /// </summary>
    /// <param name="questionId">The question ID to join</param>
    [HubMethodName("JoinQuestion")]
    public async Task JoinQuestion(Guid questionId)
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        await Groups.AddToGroupAsync(Context.ConnectionId, $"question_{questionId}");
        
        _logger.LogDebug("QA Hub: User {UserName} ({UserId}) joined question {QuestionId}", 
            userName, userId, questionId);
    }

    /// <summary>
    /// Leave a specific question's group
    /// Used when users navigate away from a question detail page
    /// </summary>
    /// <param name="questionId">The question ID to leave</param>
    [HubMethodName("LeaveQuestion")]
    public async Task LeaveQuestion(Guid questionId)
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"question_{questionId}");
        
        _logger.LogDebug("QA Hub: User {UserName} ({UserId}) left question {QuestionId}", 
            userName, userId, questionId);
    }

    #endregion

    #region Category Management

    /// <summary>
    /// Join a category group to receive notifications about new questions
    /// Used by experts and users interested in specific categories
    /// </summary>
    /// <param name="category">The category name to join</param>
    [HubMethodName("JoinCategory")]
    public async Task JoinCategory(string category)
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        if (string.IsNullOrWhiteSpace(category))
        {
            _logger.LogWarning("QA Hub: User {UserName} attempted to join empty category", userName);
            return;
        }
        
        // Normalize category name for consistent grouping
        var normalizedCategory = category.Trim().ToLowerInvariant().Replace(" ", "_");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"category_{normalizedCategory}");
        
        _logger.LogDebug("QA Hub: User {UserName} ({UserId}) joined category {Category}", 
            userName, userId, category);
    }

    /// <summary>
    /// Leave a category group
    /// </summary>
    /// <param name="category">The category name to leave</param>
    [HubMethodName("LeaveCategory")]
    public async Task LeaveCategory(string category)
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        if (string.IsNullOrWhiteSpace(category))
        {
            _logger.LogWarning("QA Hub: User {UserName} attempted to leave empty category", userName);
            return;
        }
        
        var normalizedCategory = category.Trim().ToLowerInvariant().Replace(" ", "_");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"category_{normalizedCategory}");
        
        _logger.LogDebug("QA Hub: User {UserName} ({UserId}) left category {Category}", 
            userName, userId, category);
    }

    #endregion

    #region Expert Management

    /// <summary>
    /// Join the experts group to receive priority notifications
    /// Used by users with expert status in any category
    /// </summary>
    [HubMethodName("JoinExpertsGroup")]
    public async Task JoinExpertsGroup()
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        await Groups.AddToGroupAsync(Context.ConnectionId, "experts");
        
        _logger.LogDebug("QA Hub: Expert {UserName} ({UserId}) joined experts group", 
            userName, userId);
    }

    /// <summary>
    /// Leave the experts group
    /// </summary>
    [HubMethodName("LeaveExpertsGroup")]
    public async Task LeaveExpertsGroup()
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "experts");
        
        _logger.LogDebug("QA Hub: Expert {UserName} ({UserId}) left experts group", 
            userName, userId);
    }

    #endregion

    #region Typing Indicators

    /// <summary>
    /// Send typing indicator when user is composing an answer
    /// Notifies other users viewing the same question
    /// </summary>
    /// <param name="questionId">The question being answered</param>
    /// <param name="isTyping">Whether the user is currently typing</param>
    [HubMethodName("SendTypingIndicator")]
    public async Task SendTypingIndicator(Guid questionId, bool isTyping)
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        if (userId == null)
        {
            _logger.LogWarning("QA Hub: Anonymous user attempted to send typing indicator");
            return;
        }
        
        var typingIndicator = new TypingIndicatorDto
        {
            QuestionId = questionId,
            UserId = userId.Value,
            UserName = userName,
            IsTyping = isTyping,
            Timestamp = DateTime.UtcNow
        };
        
        // Send to all users viewing this question, except the sender
        await Clients.GroupExcept($"question_{questionId}", Context.ConnectionId)
            .ReceiveTypingIndicator(typingIndicator);
        
        _logger.LogDebug("QA Hub: User {UserName} ({UserId}) {Action} typing on question {QuestionId}", 
            userName, userId, isTyping ? "started" : "stopped", questionId);
    }

    #endregion

    #region Admin and Moderation

    /// <summary>
    /// Join the moderators group for administrative notifications
    /// Used by React Dashboard clients for moderation features
    /// </summary>
    [HubMethodName("JoinModeratorsGroup")]
    public async Task JoinModeratorsGroup()
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        // TODO: Add role-based authorization check for moderator role
        // For now, allowing any authenticated user to join for development
        
        await Groups.AddToGroupAsync(Context.ConnectionId, "moderators");
        
        _logger.LogDebug("QA Hub: Moderator {UserName} ({UserId}) joined moderators group", 
            userName, userId);
    }

    /// <summary>
    /// Leave the moderators group
    /// </summary>
    [HubMethodName("LeaveModeratorsGroup")]
    public async Task LeaveModeratorsGroup()
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "moderators");
        
        _logger.LogDebug("QA Hub: Moderator {UserName} ({UserId}) left moderators group", 
            userName, userId);
    }

    #endregion

    #region Connection Health

    /// <summary>
    /// Ping method for connection health checks
    /// Used by both Angular and React clients to verify connection status
    /// </summary>
    [HubMethodName("Ping")]
    public async Task<string> Ping()
    {
        var userId = GetCurrentUserId();
        var userName = GetCurrentUserName();
        
        _logger.LogDebug("QA Hub: Ping from user {UserName} ({UserId})", userName, userId);
        
        return $"Pong from QA Hub at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC";
    }

    #endregion

    #region Helper Methods

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    private string GetCurrentUserName()
    {
        return Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? 
               Context.User?.FindFirst(ClaimTypes.Email)?.Value ?? 
               "Unknown User";
    }

    private string GetCurrentUserRole()
    {
        return Context.User?.FindFirst(ClaimTypes.Role)?.Value ?? "User";
    }

    #endregion
}