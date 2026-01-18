using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Hubs;

[Authorize]
public class GroupHub : Hub
{
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<GroupHub> _logger;

    public GroupHub(
        ICurrentUserService currentUserService,
        ILogger<GroupHub> logger)
    {
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task JoinGroup(string groupId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"group_{groupId}");
            _logger.LogInformation("User {UserId} joined group {GroupId} hub", 
                _currentUserService.UserId, groupId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining group {GroupId} hub for user {UserId}", 
                groupId, _currentUserService.UserId);
        }
    }

    public async Task LeaveGroup(string groupId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"group_{groupId}");
            _logger.LogInformation("User {UserId} left group {GroupId} hub", 
                _currentUserService.UserId, groupId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving group {GroupId} hub for user {UserId}", 
                groupId, _currentUserService.UserId);
        }
    }

    public async Task JoinDiscussion(string discussionId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"discussion_{discussionId}");
            _logger.LogInformation("User {UserId} joined discussion {DiscussionId} hub", 
                _currentUserService.UserId, discussionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining discussion {DiscussionId} hub for user {UserId}", 
                discussionId, _currentUserService.UserId);
        }
    }

    public async Task LeaveDiscussion(string discussionId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"discussion_{discussionId}");
            _logger.LogInformation("User {UserId} left discussion {DiscussionId} hub", 
                _currentUserService.UserId, discussionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving discussion {DiscussionId} hub for user {UserId}", 
                discussionId, _currentUserService.UserId);
        }
    }

    public async Task JoinEvent(string eventId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"event_{eventId}");
            _logger.LogInformation("User {UserId} joined event {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining event {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    public async Task LeaveEvent(string eventId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"event_{eventId}");
            _logger.LogInformation("User {UserId} left event {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving event {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("User {UserId} connected to GroupHub", _currentUserService.UserId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("User {UserId} disconnected from GroupHub", _currentUserService.UserId);
        await base.OnDisconnectedAsync(exception);
    }
}