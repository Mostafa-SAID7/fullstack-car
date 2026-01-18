namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface IEventNotificationService
    {
        // Event Notifications
        Task NotifyEventCreatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate);
        Task NotifyEventUpdatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate);
        Task NotifyEventCancelledAsync(Guid groupId, Guid eventId, string eventTitle);
        Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, string eventTitle, DateTime eventDate);
        Task NotifyEventAttendanceChangedAsync(Guid eventId, Guid userId, string userName, string attendanceType);

        // Event Comment Notifications
        Task SendEventCommentNotificationAsync(Guid organizerId, Guid eventId, string eventTitle, Guid commenterId, string commentContent);
        Task SendEventCommentReplyNotificationAsync(Guid parentCommenterId, Guid eventId, string eventTitle, Guid replierId, string replyContent);

        // Real-time Updates
        Task SendEventUpdateAsync(Guid eventId, object updateData);

        // Bulk Notifications
        Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null);
    }
}