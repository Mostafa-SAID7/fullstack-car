using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class EventNotificationService : BaseNotificationService, IEventNotificationService
    {
        public EventNotificationService(
            ILogger<BaseNotificationService> logger,
            IRepository<Notification> notificationRepository,
            INotificationHubService hubService)
            : base(logger, notificationRepository, hubService)
        {
        }

        public async Task NotifyEventCreatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "New Event Created", 
                $"New event '{eventTitle}' has been created for {eventDate:MMM dd, yyyy}", 
                "Info", 
                "Medium", 
                "Events", 
                null, 
                eventId, 
                "Event");
        }

        public async Task NotifyEventUpdatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Event Updated", 
                $"Event '{eventTitle}' has been updated", 
                "Info", 
                "Medium", 
                "Events", 
                null, 
                eventId, 
                "Event");
        }

        public async Task NotifyEventCancelledAsync(Guid groupId, Guid eventId, string eventTitle)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Event Cancelled", 
                $"Event '{eventTitle}' has been cancelled", 
                "Warning", 
                "High", 
                "Events", 
                null, 
                eventId, 
                "Event");
        }

        public async Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, string eventTitle, DateTime eventDate)
        {
            var tasks = attendeeIds.Select(attendeeId => SendEnhancedNotificationAsync(
                attendeeId.ToString(), 
                "Event Reminder", 
                $"Reminder: '{eventTitle}' is starting soon on {eventDate:MMM dd, yyyy 'at' HH:mm}", 
                "Info", 
                "High", 
                "Events", 
                null, 
                eventId, 
                "Event"));

            await Task.WhenAll(tasks);
        }

        public async Task NotifyEventAttendanceChangedAsync(Guid eventId, Guid userId, string userName, string attendanceType)
        {
            await SendEnhancedNotificationAsync(
                eventId.ToString(), 
                "Attendance Changed", 
                $"{userName} is now {attendanceType.ToLower()} for the event", 
                "Info", 
                "Low", 
                "Events", 
                null, 
                eventId, 
                "Event");
        }

        public async Task SendEventCommentNotificationAsync(Guid organizerId, Guid eventId, string eventTitle, Guid commenterId, string commentContent)
        {
            var truncatedContent = commentContent.Length > 50 
                ? commentContent.Substring(0, 50) + "..." 
                : commentContent;

            await SendEnhancedNotificationAsync(
                organizerId.ToString(), 
                "New Event Comment", 
                $"New comment on your event '{eventTitle}': {truncatedContent}", 
                "Info", 
                "Medium", 
                "Events", 
                null, 
                eventId, 
                "Event");
        }

        public async Task SendEventCommentReplyNotificationAsync(Guid parentCommenterId, Guid eventId, string eventTitle, Guid replierId, string replyContent)
        {
            var truncatedContent = replyContent.Length > 50 
                ? replyContent.Substring(0, 50) + "..." 
                : replyContent;

            await SendEnhancedNotificationAsync(
                parentCommenterId.ToString(), 
                "Comment Reply", 
                $"Someone replied to your comment on '{eventTitle}': {truncatedContent}", 
                "Info", 
                "Medium", 
                "Events", 
                null, 
                eventId, 
                "Event");
        }

        public async Task SendEventUpdateAsync(Guid eventId, object updateData)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"event_{eventId}", updateData);
                _logger.LogInformation("Event update sent to event {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send event update to event {EventId}", eventId);
            }
        }

        public async Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"event_{eventId}", new { message, data });
                _logger.LogInformation("Notification sent to all attendees of event {EventId}", eventId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to notify event attendees of event {EventId}", eventId);
            }
        }
    }
}