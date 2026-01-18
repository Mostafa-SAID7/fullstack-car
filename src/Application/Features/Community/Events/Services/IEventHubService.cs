namespace Application.Features.Community.Events.Services
{
    public interface IEventHubService
    {
        // Event updates
        Task NotifyEventCreatedAsync(Guid eventId, object eventData);
        Task NotifyEventUpdatedAsync(Guid eventId, object eventData);
        Task NotifyEventDeletedAsync(Guid eventId, string reason);
        Task NotifyEventCancelledAsync(Guid eventId, string reason);
        Task NotifyEventFeaturedAsync(Guid eventId, bool isFeatured);

        // Attendance updates
        Task NotifyAttendanceChangedAsync(Guid eventId, Guid userId, string attendanceType, object attendanceData);
        Task NotifyAttendanceApprovedAsync(Guid eventId, Guid userId, object attendanceData);
        Task NotifyAttendanceRejectedAsync(Guid eventId, Guid userId, string reason);
        Task NotifyAttendeeCheckedInAsync(Guid eventId, Guid userId, object attendanceData);
        Task NotifyAttendeeRemovedAsync(Guid eventId, Guid userId, string reason);

        // Comment updates
        Task NotifyCommentAddedAsync(Guid eventId, object commentData);
        Task NotifyCommentUpdatedAsync(Guid eventId, Guid commentId, object commentData);
        Task NotifyCommentDeletedAsync(Guid eventId, Guid commentId);
        Task NotifyCommentLikedAsync(Guid eventId, Guid commentId, Guid userId, int likeCount);
        Task NotifyCommentUnlikedAsync(Guid eventId, Guid commentId, Guid userId, int likeCount);

        // Event updates/announcements
        Task NotifyEventUpdatePostedAsync(Guid eventId, object updateData);
        Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, object reminderData);

        // Invitation updates
        Task NotifyInvitationSentAsync(Guid eventId, List<string> emails, object invitationData);
        Task NotifyInvitationAcceptedAsync(Guid eventId, string email, object attendanceData);
        Task NotifyInvitationDeclinedAsync(Guid eventId, string email);
        Task NotifyInvitationCancelledAsync(Guid eventId, List<Guid> invitationIds);

        // Organizer-specific notifications
        Task NotifyOrganizerOfNewAttendeeAsync(Guid eventId, Guid organizerId, object attendeeData);
        Task NotifyOrganizerOfAttendanceRequestAsync(Guid eventId, Guid organizerId, object requestData);
        Task NotifyOrganizerOfCommentAsync(Guid eventId, Guid organizerId, object commentData);

        // Real-time statistics
        Task UpdateEventStatsAsync(Guid eventId, object statsData);
        Task UpdateAttendanceStatsAsync(Guid eventId, object attendanceStats);

        // Bulk notifications
        Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null);
        Task NotifyEventOrganizersAsync(Guid eventId, string message, object? data = null);

        // Connection management
        Task AddUserToEventGroupAsync(string connectionId, Guid eventId);
        Task RemoveUserFromEventGroupAsync(string connectionId, Guid eventId);
        Task AddUserToEventCommentsGroupAsync(string connectionId, Guid eventId);
        Task RemoveUserFromEventCommentsGroupAsync(string connectionId, Guid eventId);
        Task AddUserToEventAttendeesGroupAsync(string connectionId, Guid eventId);
        Task RemoveUserFromEventAttendeesGroupAsync(string connectionId, Guid eventId);
    }
}