namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface INotificationService
    {
        // Basic notification methods
        Task SendNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? sourceUserId = null);
        Task SendNotificationAsync(string userId, string title, string message, string? targetUrl, Guid? sourceUserId, CancellationToken cancellationToken);
        Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message);
        Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message, CancellationToken cancellationToken);
        
        // Enhanced notification methods
        Task SendMarketplaceNotificationAsync(string userId, string title, string message, string notificationType = "Info", string priority = "Medium", string? targetUrl = null, Guid? relatedEntityId = null, string? relatedEntityType = null);
        Task SendSystemNotificationAsync(string userId, string title, string message, string priority = "Medium", string? targetUrl = null);
        Task SendSecurityNotificationAsync(string userId, string title, string message, string? targetUrl = null);
        Task SendPromotionNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? promotionId = null);
        Task SendBulkMarketplaceNotificationAsync(IEnumerable<string> userIds, string title, string message, string type = "Info", string priority = "Medium", string? targetUrl = null);
        Task SendSystemBroadcastAsync(string title, string message, string priority = "Medium");
        
        // Retrieval methods
        Task<IEnumerable<object>> GetUserNotificationsAsync(string userId);
        Task<IEnumerable<object>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken);
        Task<IEnumerable<object>> GetNotificationsByTypeAsync(string userId, string type, int limit = 10);
        Task<IEnumerable<object>> GetNotificationsByCategoryAsync(string userId, string category, int limit = 10);
        
        // Management methods
        Task MarkAsReadAsync(string notificationId);
        Task MarkAsReadAsync(string notificationId, CancellationToken cancellationToken);
        Task MarkAllAsReadAsync(string userId);
        Task MarkAllAsReadAsync(string userId, CancellationToken cancellationToken);
        Task DeleteNotificationAsync(string notificationId);
        Task DeleteNotificationAsync(string notificationId, CancellationToken cancellationToken);
        Task<int> GetUnreadCountAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId, CancellationToken cancellationToken);

        // Group Notifications
        Task NotifyGroupMemberJoinedAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupMemberLeftAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupMemberBannedAsync(Guid groupId, Guid userId, string userName, string reason);
        Task NotifyGroupMemberUnbannedAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupMemberRoleChangedAsync(Guid groupId, Guid userId, string userName, string newRole);
        Task NotifyGroupJoinRequestAsync(Guid groupId, Guid requesterId, string requesterName);
        Task NotifyGroupJoinRequestApprovedAsync(Guid groupId, Guid userId, string groupName);
        Task NotifyGroupJoinRequestRejectedAsync(Guid groupId, Guid userId, string groupName, string reason);
        Task NotifyGroupInvitationAsync(Guid groupId, string email, string groupName, string inviterName);
        Task NotifyGroupOwnershipTransferredAsync(Guid groupId, Guid newOwnerId, Guid previousOwnerId, string groupName);

        // Event Notifications
        Task NotifyEventCreatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime startDate);
        Task NotifyEventUpdatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime startDate);
        Task NotifyEventCancelledAsync(Guid groupId, Guid eventId, string eventTitle);
        Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, string eventTitle, DateTime startDate);
        Task NotifyEventAttendanceChangedAsync(Guid eventId, Guid userId, string userName, string attendanceType);

        // Discussion Notifications
        Task NotifyDiscussionCreatedAsync(Guid groupId, Guid discussionId, string title, Guid createdBy, string createdByName);
        Task NotifyDiscussionReplyAsync(Guid discussionId, Guid replyId, string content, Guid createdBy, string createdByName);
        Task NotifyDiscussionPinnedAsync(Guid groupId, Guid discussionId, string title);
        Task NotifyDiscussionLockedAsync(Guid groupId, Guid discussionId, string title, string reason);
        Task NotifyDiscussionUnlockedAsync(Guid groupId, Guid discussionId, string title);

        // Real-time Updates
        Task SendGroupUpdateAsync(Guid groupId, object data);
        Task SendEventUpdateAsync(Guid eventId, object data);
        Task SendDiscussionUpdateAsync(Guid discussionId, object data);
        Task SendUserNotificationAsync(Guid userId, object notification);
        Task SendGroupMembersUpdateAsync(Guid groupId, object memberData);

        // Bulk Notifications
        Task NotifyGroupMembersAsync(Guid groupId, string message, object? data = null);
        Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null);
        Task NotifyDiscussionParticipantsAsync(Guid discussionId, string message, object? data = null);

        // System Notifications
        Task NotifySystemMaintenanceAsync(DateTime scheduledTime, string message);
        Task NotifySystemUpdateAsync(string version, string releaseNotes);
    }
}
