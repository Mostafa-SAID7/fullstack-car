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
        Task NotifyGroupInvitationAsync(Guid userId, string inviterName, string groupName, string message);
        Task NotifyGroupOwnershipTransferredAsync(Guid groupId, Guid oldOwnerId, Guid newOwnerId, string groupName);

        // Event Notifications
        Task NotifyEventCreatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate);
        Task NotifyEventUpdatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate);
        Task NotifyEventCancelledAsync(Guid groupId, Guid eventId, string eventTitle);
        Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, string eventTitle, DateTime eventDate);
        Task NotifyEventAttendanceChangedAsync(Guid eventId, Guid userId, string userName, string attendanceType);

        // Discussion Notifications
        Task NotifyDiscussionCreatedAsync(Guid groupId, Guid discussionId, string discussionTitle, Guid creatorId, string creatorName);
        Task NotifyDiscussionReplyAsync(Guid groupId, Guid discussionId, string discussionTitle, Guid replyerId, string replierName);
        Task NotifyDiscussionPinnedAsync(Guid groupId, Guid discussionId, string discussionTitle);
        Task NotifyDiscussionLockedAsync(Guid groupId, Guid discussionId, string discussionTitle, string reason);
        Task NotifyDiscussionUnlockedAsync(Guid groupId, Guid discussionId, string discussionTitle);

        // Real-time Updates
        Task SendGroupUpdateAsync(Guid groupId, object updateData);
        Task SendEventUpdateAsync(Guid eventId, object updateData);
        Task SendDiscussionUpdateAsync(Guid discussionId, object updateData);
        Task SendUserNotificationAsync(Guid userId, object notificationData);
        Task SendGroupMembersUpdateAsync(Guid groupId, object updateData);

        // Bulk Notifications
        Task NotifyGroupMembersAsync(Guid groupId, string message, object? data = null);
        Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null);
        Task NotifyDiscussionParticipantsAsync(Guid discussionId, string message, object? data = null);

        // System Notifications
        Task NotifySystemMaintenanceAsync(DateTime maintenanceTime, string message);
        Task NotifySystemUpdateAsync(string version, string updateNotes);

        // Event Comment Notifications
        Task SendEventCommentNotificationAsync(Guid organizerId, Guid eventId, string eventTitle, Guid commenterId, string commentContent);
        Task SendEventCommentReplyNotificationAsync(Guid parentCommenterId, Guid eventId, string eventTitle, Guid replierId, string replyContent);

        // Event Update Notifications
        Task SendEventUpdateNotificationAsync(Guid userId, Guid eventId, string eventTitle, string updateContent);
    }
}
