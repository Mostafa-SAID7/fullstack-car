using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Hubs;

[Authorize]
public class EventHub : Hub
{
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<EventHub> _logger;

    public EventHub(
        ICurrentUserService currentUserService,
        ILogger<EventHub> logger)
    {
        _currentUserService = currentUserService;
        _logger = logger;
    }

    // Event-specific methods
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

    // Event comments
    public async Task JoinEventComments(string eventId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"event_comments_{eventId}");
            _logger.LogInformation("User {UserId} joined event comments {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining event comments {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    public async Task LeaveEventComments(string eventId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"event_comments_{eventId}");
            _logger.LogInformation("User {UserId} left event comments {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving event comments {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    // Event attendees
    public async Task JoinEventAttendees(string eventId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"event_attendees_{eventId}");
            _logger.LogInformation("User {UserId} joined event attendees {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining event attendees {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    public async Task LeaveEventAttendees(string eventId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"event_attendees_{eventId}");
            _logger.LogInformation("User {UserId} left event attendees {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving event attendees {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    // Event organizer-specific methods
    public async Task JoinEventOrganizer(string eventId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"event_organizer_{eventId}");
            _logger.LogInformation("User {UserId} joined event organizer {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining event organizer {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    public async Task LeaveEventOrganizer(string eventId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"event_organizer_{eventId}");
            _logger.LogInformation("User {UserId} left event organizer {EventId} hub", 
                _currentUserService.UserId, eventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving event organizer {EventId} hub for user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    // User typing in event comments
    public async Task EventCommentTyping(string eventId)
    {
        try
        {
            var userId = _currentUserService.UserId;
            await Clients.OthersInGroup($"event_comments_{eventId}")
                .SendAsync("UserTypingInEventComments", eventId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending typing indicator for event {EventId} by user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    public async Task EventCommentStoppedTyping(string eventId)
    {
        try
        {
            var userId = _currentUserService.UserId;
            await Clients.OthersInGroup($"event_comments_{eventId}")
                .SendAsync("UserStoppedTypingInEventComments", eventId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending stopped typing indicator for event {EventId} by user {UserId}", 
                eventId, _currentUserService.UserId);
        }
    }

    // Connection management
    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("User {UserId} connected to EventHub", _currentUserService.UserId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("User {UserId} disconnected from EventHub", _currentUserService.UserId);
        await base.OnDisconnectedAsync(exception);
    }
}