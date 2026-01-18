using Application.Features.Community.Events.Services;
using Microsoft.AspNetCore.SignalR;
using Infrastructure.Hubs;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Events
{
    public class EventHubService : IEventHubService
    {
        private readonly IHubContext<EventHub> _hubContext;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly ILogger<EventHubService> _logger;

        public EventHubService(
            IHubContext<EventHub> hubContext,
            IHubContext<NotificationHub> notificationHubContext,
            ILogger<EventHubService> logger)
        {
            _hubContext = hubContext;
            _notificationHubContext = notificationHubContext;
            _logger = logger;
        }

        // Event updates
        public async Task NotifyEventCreatedAsync(Guid eventId, object eventData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventCreated", eventId, eventData);
                
                _logger.LogInformation("Notified event created: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying event created: {EventId}", eventId);
            }
        }

        public async Task NotifyEventUpdatedAsync(Guid eventId, object eventData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventUpdated", eventId, eventData);
                
                _logger.LogInformation("Notified event updated: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying event updated: {EventId}", eventId);
            }
        }

        public async Task NotifyEventDeletedAsync(Guid eventId, string reason)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventDeleted", eventId, reason);
                
                _logger.LogInformation("Notified event deleted: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying event deleted: {EventId}", eventId);
            }
        }

        public async Task NotifyEventCancelledAsync(Guid eventId, string reason)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventCancelled", eventId, reason);
                
                _logger.LogInformation("Notified event cancelled: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying event cancelled: {EventId}", eventId);
            }
        }

        public async Task NotifyEventFeaturedAsync(Guid eventId, bool isFeatured)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventFeatured", eventId, isFeatured);
                
                _logger.LogInformation("Notified event featured status changed: {EventId} - {IsFeatured}", eventId, isFeatured);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying event featured: {EventId}", eventId);
            }
        }

        // Attendance updates
        public async Task NotifyAttendanceChangedAsync(Guid eventId, Guid userId, string attendanceType, object attendanceData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_attendees_{eventId}")
                    .SendAsync("AttendanceChanged", eventId, userId, attendanceType, attendanceData);
                
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("AttendanceChanged", eventId, userId, attendanceType, attendanceData);
                
                _logger.LogInformation("Notified attendance changed: {EventId} - User {UserId} - {AttendanceType}", 
                    eventId, userId, attendanceType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying attendance changed: {EventId} - {UserId}", eventId, userId);
            }
        }

        public async Task NotifyAttendanceApprovedAsync(Guid eventId, Guid userId, object attendanceData)
        {
            try
            {
                await _notificationHubContext.Clients.Group($"user_{userId}")
                    .SendAsync("AttendanceApproved", eventId, attendanceData);
                
                await _hubContext.Clients.Group($"event_attendees_{eventId}")
                    .SendAsync("AttendanceApproved", eventId, userId, attendanceData);
                
                _logger.LogInformation("Notified attendance approved: {EventId} - User {UserId}", eventId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying attendance approved: {EventId} - {UserId}", eventId, userId);
            }
        }

        public async Task NotifyAttendanceRejectedAsync(Guid eventId, Guid userId, string reason)
        {
            try
            {
                await _notificationHubContext.Clients.Group($"user_{userId}")
                    .SendAsync("AttendanceRejected", eventId, reason);
                
                _logger.LogInformation("Notified attendance rejected: {EventId} - User {UserId}", eventId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying attendance rejected: {EventId} - {UserId}", eventId, userId);
            }
        }

        public async Task NotifyAttendeeCheckedInAsync(Guid eventId, Guid userId, object attendanceData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_attendees_{eventId}")
                    .SendAsync("AttendeeCheckedIn", eventId, userId, attendanceData);
                
                await _notificationHubContext.Clients.Group($"user_{userId}")
                    .SendAsync("CheckedInToEvent", eventId, attendanceData);
                
                _logger.LogInformation("Notified attendee checked in: {EventId} - User {UserId}", eventId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying attendee checked in: {EventId} - {UserId}", eventId, userId);
            }
        }

        public async Task NotifyAttendeeRemovedAsync(Guid eventId, Guid userId, string reason)
        {
            try
            {
                await _notificationHubContext.Clients.Group($"user_{userId}")
                    .SendAsync("RemovedFromEvent", eventId, reason);
                
                await _hubContext.Clients.Group($"event_attendees_{eventId}")
                    .SendAsync("AttendeeRemoved", eventId, userId, reason);
                
                _logger.LogInformation("Notified attendee removed: {EventId} - User {UserId}", eventId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying attendee removed: {EventId} - {UserId}", eventId, userId);
            }
        }

        // Comment updates
        public async Task NotifyCommentAddedAsync(Guid eventId, object commentData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_comments_{eventId}")
                    .SendAsync("CommentAdded", eventId, commentData);
                
                _logger.LogInformation("Notified comment added to event: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying comment added: {EventId}", eventId);
            }
        }

        public async Task NotifyCommentUpdatedAsync(Guid eventId, Guid commentId, object commentData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_comments_{eventId}")
                    .SendAsync("CommentUpdated", eventId, commentId, commentData);
                
                _logger.LogInformation("Notified comment updated: {EventId} - Comment {CommentId}", eventId, commentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying comment updated: {EventId} - {CommentId}", eventId, commentId);
            }
        }

        public async Task NotifyCommentDeletedAsync(Guid eventId, Guid commentId)
        {
            try
            {
                await _hubContext.Clients.Group($"event_comments_{eventId}")
                    .SendAsync("CommentDeleted", eventId, commentId);
                
                _logger.LogInformation("Notified comment deleted: {EventId} - Comment {CommentId}", eventId, commentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying comment deleted: {EventId} - {CommentId}", eventId, commentId);
            }
        }

        public async Task NotifyCommentLikedAsync(Guid eventId, Guid commentId, Guid userId, int likeCount)
        {
            try
            {
                await _hubContext.Clients.Group($"event_comments_{eventId}")
                    .SendAsync("CommentLiked", eventId, commentId, userId, likeCount);
                
                _logger.LogInformation("Notified comment liked: {EventId} - Comment {CommentId} - User {UserId}", 
                    eventId, commentId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying comment liked: {EventId} - {CommentId}", eventId, commentId);
            }
        }

        public async Task NotifyCommentUnlikedAsync(Guid eventId, Guid commentId, Guid userId, int likeCount)
        {
            try
            {
                await _hubContext.Clients.Group($"event_comments_{eventId}")
                    .SendAsync("CommentUnliked", eventId, commentId, userId, likeCount);
                
                _logger.LogInformation("Notified comment unliked: {EventId} - Comment {CommentId} - User {UserId}", 
                    eventId, commentId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying comment unliked: {EventId} - {CommentId}", eventId, commentId);
            }
        }

        // Event updates/announcements
        public async Task NotifyEventUpdatePostedAsync(Guid eventId, object updateData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventUpdatePosted", eventId, updateData);
                
                _logger.LogInformation("Notified event update posted: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying event update posted: {EventId}", eventId);
            }
        }

        public async Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, object reminderData)
        {
            try
            {
                var tasks = attendeeIds.Select(userId => 
                    _notificationHubContext.Clients.Group($"user_{userId}")
                        .SendAsync("EventReminder", eventId, reminderData));
                
                await Task.WhenAll(tasks);
                
                _logger.LogInformation("Sent event reminder to {Count} attendees for event: {EventId}", 
                    attendeeIds.Count, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending event reminder: {EventId}", eventId);
            }
        }

        // Invitation updates
        public async Task NotifyInvitationSentAsync(Guid eventId, List<string> emails, object invitationData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("InvitationsSent", eventId, emails.Count, invitationData);
                
                _logger.LogInformation("Notified invitations sent: {EventId} - {Count} invitations", 
                    eventId, emails.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying invitations sent: {EventId}", eventId);
            }
        }

        public async Task NotifyInvitationAcceptedAsync(Guid eventId, string email, object attendanceData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("InvitationAccepted", eventId, email, attendanceData);
                
                _logger.LogInformation("Notified invitation accepted: {EventId} - {Email}", eventId, email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying invitation accepted: {EventId}", eventId);
            }
        }

        public async Task NotifyInvitationDeclinedAsync(Guid eventId, string email)
        {
            try
            {
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("InvitationDeclined", eventId, email);
                
                _logger.LogInformation("Notified invitation declined: {EventId} - {Email}", eventId, email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying invitation declined: {EventId}", eventId);
            }
        }

        public async Task NotifyInvitationCancelledAsync(Guid eventId, List<Guid> invitationIds)
        {
            try
            {
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("InvitationsCancelled", eventId, invitationIds);
                
                _logger.LogInformation("Notified invitations cancelled: {EventId} - {Count} invitations", 
                    eventId, invitationIds.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying invitations cancelled: {EventId}", eventId);
            }
        }

        // Organizer-specific notifications
        public async Task NotifyOrganizerOfNewAttendeeAsync(Guid eventId, Guid organizerId, object attendeeData)
        {
            try
            {
                await _notificationHubContext.Clients.Group($"user_{organizerId}")
                    .SendAsync("NewAttendee", eventId, attendeeData);
                
                _logger.LogInformation("Notified organizer of new attendee: {EventId} - Organizer {OrganizerId}", 
                    eventId, organizerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying organizer of new attendee: {EventId}", eventId);
            }
        }

        public async Task NotifyOrganizerOfAttendanceRequestAsync(Guid eventId, Guid organizerId, object requestData)
        {
            try
            {
                await _notificationHubContext.Clients.Group($"user_{organizerId}")
                    .SendAsync("AttendanceRequest", eventId, requestData);
                
                _logger.LogInformation("Notified organizer of attendance request: {EventId} - Organizer {OrganizerId}", 
                    eventId, organizerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying organizer of attendance request: {EventId}", eventId);
            }
        }

        public async Task NotifyOrganizerOfCommentAsync(Guid eventId, Guid organizerId, object commentData)
        {
            try
            {
                await _notificationHubContext.Clients.Group($"user_{organizerId}")
                    .SendAsync("NewEventComment", eventId, commentData);
                
                _logger.LogInformation("Notified organizer of new comment: {EventId} - Organizer {OrganizerId}", 
                    eventId, organizerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying organizer of comment: {EventId}", eventId);
            }
        }

        // Real-time statistics
        public async Task UpdateEventStatsAsync(Guid eventId, object statsData)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventStatsUpdated", eventId, statsData);
                
                _logger.LogInformation("Updated event stats: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating event stats: {EventId}", eventId);
            }
        }

        public async Task UpdateAttendanceStatsAsync(Guid eventId, object attendanceStats)
        {
            try
            {
                await _hubContext.Clients.Group($"event_attendees_{eventId}")
                    .SendAsync("AttendanceStatsUpdated", eventId, attendanceStats);
                
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("AttendanceStatsUpdated", eventId, attendanceStats);
                
                _logger.LogInformation("Updated attendance stats: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating attendance stats: {EventId}", eventId);
            }
        }

        // Bulk notifications
        public async Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null)
        {
            try
            {
                await _hubContext.Clients.Group($"event_{eventId}")
                    .SendAsync("EventNotification", eventId, message, data);
                
                _logger.LogInformation("Sent bulk notification to event attendees: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending bulk notification to attendees: {EventId}", eventId);
            }
        }

        public async Task NotifyEventOrganizersAsync(Guid eventId, string message, object? data = null)
        {
            try
            {
                await _hubContext.Clients.Group($"event_organizer_{eventId}")
                    .SendAsync("OrganizerNotification", eventId, message, data);
                
                _logger.LogInformation("Sent notification to event organizers: {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification to organizers: {EventId}", eventId);
            }
        }

        // Connection management
        public async Task AddUserToEventGroupAsync(string connectionId, Guid eventId)
        {
            try
            {
                await _hubContext.Groups.AddToGroupAsync(connectionId, $"event_{eventId}");
                _logger.LogInformation("Added connection {ConnectionId} to event group: {EventId}", connectionId, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding connection to event group: {EventId}", eventId);
            }
        }

        public async Task RemoveUserFromEventGroupAsync(string connectionId, Guid eventId)
        {
            try
            {
                await _hubContext.Groups.RemoveFromGroupAsync(connectionId, $"event_{eventId}");
                _logger.LogInformation("Removed connection {ConnectionId} from event group: {EventId}", connectionId, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing connection from event group: {EventId}", eventId);
            }
        }

        public async Task AddUserToEventCommentsGroupAsync(string connectionId, Guid eventId)
        {
            try
            {
                await _hubContext.Groups.AddToGroupAsync(connectionId, $"event_comments_{eventId}");
                _logger.LogInformation("Added connection {ConnectionId} to event comments group: {EventId}", connectionId, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding connection to event comments group: {EventId}", eventId);
            }
        }

        public async Task RemoveUserFromEventCommentsGroupAsync(string connectionId, Guid eventId)
        {
            try
            {
                await _hubContext.Groups.RemoveFromGroupAsync(connectionId, $"event_comments_{eventId}");
                _logger.LogInformation("Removed connection {ConnectionId} from event comments group: {EventId}", connectionId, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing connection from event comments group: {EventId}", eventId);
            }
        }

        public async Task AddUserToEventAttendeesGroupAsync(string connectionId, Guid eventId)
        {
            try
            {
                await _hubContext.Groups.AddToGroupAsync(connectionId, $"event_attendees_{eventId}");
                _logger.LogInformation("Added connection {ConnectionId} to event attendees group: {EventId}", connectionId, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding connection to event attendees group: {EventId}", eventId);
            }
        }

        public async Task RemoveUserFromEventAttendeesGroupAsync(string connectionId, Guid eventId)
        {
            try
            {
                await _hubContext.Groups.RemoveFromGroupAsync(connectionId, $"event_attendees_{eventId}");
                _logger.LogInformation("Removed connection {ConnectionId} from event attendees group: {EventId}", connectionId, eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing connection from event attendees group: {EventId}", eventId);
            }
        }
    }
}