using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly IRepository<Notification> _notificationRepository;
        private readonly INotificationHubService _hubService;
        private readonly IGroupNotificationService _groupNotificationService;
        private readonly IEventNotificationService _eventNotificationService;
        private readonly ISystemNotificationService _systemNotificationService;

        public NotificationService(
            ILogger<NotificationService> logger,
            IRepository<Notification> notificationRepository,
            INotificationHubService hubService,
            IGroupNotificationService groupNotificationService,
            IEventNotificationService eventNotificationService,
            ISystemNotificationService systemNotificationService)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
            _hubService = hubService;
            _groupNotificationService = groupNotificationService;
            _eventNotificationService = eventNotificationService;
            _systemNotificationService = systemNotificationService;
        }

        // Basic notification methods
        public async Task SendNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? sourceUserId = null)
        {
            await SendNotificationAsync(userId, title, message, targetUrl, sourceUserId, CancellationToken.None);
        }

        public async Task SendNotificationAsync(string userId, string title, string message, string? targetUrl, Guid? sourceUserId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return;

            var notification = new Notification
            {
                UserId = userGuid,
                Title = title,
                Message = message,
                TargetUrl = targetUrl,
                SourceUserId = sourceUserId,
                Type = "Info",
                Priority = "Medium",
                Category = "System",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification, cancellationToken);
            
            _logger.LogInformation("Sending real-time notification to user {UserId}: {Title}", userId, title);

            try
            {
                await _hubService.SendNotificationToUserAsync(userId, new
                {
                    id = notification.Id.ToString(),
                    title = notification.Title,
                    message = notification.Message,
                    type = notification.Type,
                    priority = notification.Priority,
                    category = notification.Category,
                    createdAt = notification.CreatedAt,
                    isRead = notification.IsRead,
                    targetUrl = notification.TargetUrl,
                    sourceUserId = notification.SourceUserId?.ToString()
                });
                
                _logger.LogInformation("Real-time notification sent successfully to user {UserId}", userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send real-time notification to user {UserId}, but notification was saved", userId);
            }
        }

        public async Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message)
        {
            await SendBulkNotificationAsync(userIds, title, message, CancellationToken.None);
        }

        public async Task SendBulkNotificationAsync(IEnumerable<string> userIds, string title, string message, CancellationToken cancellationToken)
        {
            foreach (var userId in userIds)
            {
                await SendNotificationAsync(userId, title, message, null, null, cancellationToken);
            }
        }

        // Enhanced notification methods
        public async Task SendMarketplaceNotificationAsync(string userId, string title, string message, string notificationType = "Info", string priority = "Medium", string? targetUrl = null, Guid? relatedEntityId = null, string? relatedEntityType = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, notificationType, priority, "Marketplace", targetUrl, relatedEntityId, relatedEntityType);
        }

        public async Task SendSystemNotificationAsync(string userId, string title, string message, string priority = "Medium", string? targetUrl = null)
        {
            await _systemNotificationService.SendSystemNotificationAsync(userId, title, message, priority, targetUrl);
        }

        public async Task SendSecurityNotificationAsync(string userId, string title, string message, string? targetUrl = null)
        {
            await _systemNotificationService.SendSecurityNotificationAsync(userId, title, message, targetUrl);
        }

        public async Task SendPromotionNotificationAsync(string userId, string title, string message, string? targetUrl = null, Guid? promotionId = null)
        {
            await SendEnhancedNotificationAsync(userId, title, message, "Success", "Medium", "Promotion", targetUrl, promotionId, "Promotion");
        }

        public async Task SendBulkMarketplaceNotificationAsync(IEnumerable<string> userIds, string title, string message, string type = "Info", string priority = "Medium", string? targetUrl = null)
        {
            var tasks = userIds.Select(userId => SendMarketplaceNotificationAsync(userId, title, message, type, priority, targetUrl));
            await Task.WhenAll(tasks);
        }

        public async Task SendSystemBroadcastAsync(string title, string message, string priority = "Medium")
        {
            await _systemNotificationService.SendSystemBroadcastAsync(title, message, priority);
        }

        // Retrieval methods
        public async Task<IEnumerable<object>> GetUserNotificationsAsync(string userId)
        {
            return await GetUserNotificationsAsync(userId, CancellationToken.None);
        }

        public async Task<IEnumerable<object>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return Enumerable.Empty<object>();

            var notifications = await _notificationRepository.GetAllAsync(cancellationToken);
            return notifications.Where(n => n.UserId == userGuid && !n.IsDeleted)
                               .OrderByDescending(n => n.CreatedAt)
                               .Select(n => new
                               {
                                   id = n.Id.ToString(),
                                   title = n.Title,
                                   message = n.Message,
                                   type = n.Type,
                                   priority = n.Priority,
                                   category = n.Category,
                                   read = n.IsRead,
                                   createdAt = n.CreatedAt,
                                   readAt = n.ReadAt,
                                   targetUrl = n.TargetUrl,
                                   relatedEntityId = n.RelatedEntityId?.ToString(),
                                   relatedEntityType = n.RelatedEntityType,
                                   sourceUserId = n.SourceUserId?.ToString()
                               });
        }

        public async Task<IEnumerable<object>> GetNotificationsByTypeAsync(string userId, string type, int limit = 10)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return Enumerable.Empty<object>();

            var notifications = await _notificationRepository.GetAllAsync();
            return notifications.Where(n => n.UserId == userGuid && n.Type == type && !n.IsDeleted)
                               .OrderByDescending(n => n.CreatedAt)
                               .Take(limit)
                               .Select(n => new
                               {
                                   id = n.Id.ToString(),
                                   title = n.Title,
                                   message = n.Message,
                                   type = n.Type,
                                   priority = n.Priority,
                                   category = n.Category,
                                   read = n.IsRead,
                                   createdAt = n.CreatedAt,
                                   readAt = n.ReadAt,
                                   targetUrl = n.TargetUrl,
                                   relatedEntityId = n.RelatedEntityId?.ToString(),
                                   relatedEntityType = n.RelatedEntityType,
                                   sourceUserId = n.SourceUserId?.ToString()
                               });
        }

        public async Task<IEnumerable<object>> GetNotificationsByCategoryAsync(string userId, string category, int limit = 10)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return Enumerable.Empty<object>();

            var notifications = await _notificationRepository.GetAllAsync();
            return notifications.Where(n => n.UserId == userGuid && n.Category == category && !n.IsDeleted)
                               .OrderByDescending(n => n.CreatedAt)
                               .Take(limit)
                               .Select(n => new
                               {
                                   id = n.Id.ToString(),
                                   title = n.Title,
                                   message = n.Message,
                                   type = n.Type,
                                   priority = n.Priority,
                                   category = n.Category,
                                   read = n.IsRead,
                                   createdAt = n.CreatedAt,
                                   readAt = n.ReadAt,
                                   targetUrl = n.TargetUrl,
                                   relatedEntityId = n.RelatedEntityId?.ToString(),
                                   relatedEntityType = n.RelatedEntityType,
                                   sourceUserId = n.SourceUserId?.ToString()
                               });
        }

        // Management methods
        public async Task MarkAsReadAsync(string notificationId)
        {
            await MarkAsReadAsync(notificationId, CancellationToken.None);
        }

        public async Task MarkAsReadAsync(string notificationId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(notificationId, out var idGuid)) return;

            var notification = await _notificationRepository.GetByIdAsync(idGuid, cancellationToken);
            if (notification != null && !notification.IsRead)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _notificationRepository.UpdateAsync(notification, cancellationToken);
            }
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            await MarkAllAsReadAsync(userId, CancellationToken.None);
        }

        public async Task MarkAllAsReadAsync(string userId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return;

            var notifications = await _notificationRepository.GetAllAsync(cancellationToken);
            var unreadNotifications = notifications.Where(n => n.UserId == userGuid && !n.IsRead && !n.IsDeleted).ToList();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _notificationRepository.UpdateAsync(notification, cancellationToken);
            }
        }

        public async Task DeleteNotificationAsync(string notificationId)
        {
            await DeleteNotificationAsync(notificationId, CancellationToken.None);
        }

        public async Task DeleteNotificationAsync(string notificationId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(notificationId, out var idGuid)) return;

            var notification = await _notificationRepository.GetByIdAsync(idGuid, cancellationToken);
            if (notification != null)
            {
                await _notificationRepository.DeleteAsync(notification, cancellationToken);
            }
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await GetUnreadCountAsync(userId, CancellationToken.None);
        }

        public async Task<int> GetUnreadCountAsync(string userId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return 0;

            var notifications = await _notificationRepository.GetAllAsync(cancellationToken);
            return notifications.Count(n => n.UserId == userGuid && !n.IsRead && !n.IsDeleted);
        }

        // Delegate to specialized services
        public async Task NotifyGroupMemberJoinedAsync(Guid groupId, Guid userId, string userName)
        {
            await _groupNotificationService.NotifyGroupMemberJoinedAsync(groupId, userId, userName);
        }

        public async Task NotifyGroupMemberLeftAsync(Guid groupId, Guid userId, string userName)
        {
            await _groupNotificationService.NotifyGroupMemberLeftAsync(groupId, userId, userName);
        }

        public async Task NotifyGroupMemberBannedAsync(Guid groupId, Guid userId, string userName, string reason)
        {
            await _groupNotificationService.NotifyGroupMemberBannedAsync(groupId, userId, userName, reason);
        }

        public async Task NotifyGroupMemberUnbannedAsync(Guid groupId, Guid userId, string userName)
        {
            await _groupNotificationService.NotifyGroupMemberUnbannedAsync(groupId, userId, userName);
        }

        public async Task NotifyGroupMemberRoleChangedAsync(Guid groupId, Guid userId, string userName, string newRole)
        {
            await _groupNotificationService.NotifyGroupMemberRoleChangedAsync(groupId, userId, userName, newRole);
        }

        public async Task NotifyGroupJoinRequestAsync(Guid groupId, Guid userId, string userName)
        {
            await _groupNotificationService.NotifyGroupJoinRequestAsync(groupId, userId, userName);
        }

        public async Task NotifyGroupJoinRequestApprovedAsync(Guid groupId, Guid userId, string groupName)
        {
            await _groupNotificationService.NotifyGroupJoinRequestApprovedAsync(groupId, userId, groupName);
        }

        public async Task NotifyGroupJoinRequestRejectedAsync(Guid groupId, Guid userId, string groupName, string reason)
        {
            await _groupNotificationService.NotifyGroupJoinRequestRejectedAsync(groupId, userId, groupName, reason);
        }

        public async Task NotifyGroupInvitationAsync(Guid userId, string inviterName, string groupName, string message)
        {
            await _groupNotificationService.NotifyGroupInvitationAsync(userId, inviterName, groupName, message);
        }

        public async Task NotifyGroupOwnershipTransferredAsync(Guid groupId, Guid oldOwnerId, Guid newOwnerId, string groupName)
        {
            await _groupNotificationService.NotifyGroupOwnershipTransferredAsync(groupId, oldOwnerId, newOwnerId, groupName);
        }

        // Event Notifications
        public async Task NotifyEventCreatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate)
        {
            await _eventNotificationService.NotifyEventCreatedAsync(groupId, eventId, eventTitle, eventDate);
        }

        public async Task NotifyEventUpdatedAsync(Guid groupId, Guid eventId, string eventTitle, DateTime eventDate)
        {
            await _eventNotificationService.NotifyEventUpdatedAsync(groupId, eventId, eventTitle, eventDate);
        }

        public async Task NotifyEventCancelledAsync(Guid groupId, Guid eventId, string eventTitle)
        {
            await _eventNotificationService.NotifyEventCancelledAsync(groupId, eventId, eventTitle);
        }

        public async Task NotifyEventReminderAsync(Guid eventId, List<Guid> attendeeIds, string eventTitle, DateTime eventDate)
        {
            await _eventNotificationService.NotifyEventReminderAsync(eventId, attendeeIds, eventTitle, eventDate);
        }

        public async Task NotifyEventAttendanceChangedAsync(Guid eventId, Guid userId, string userName, string attendanceType)
        {
            await _eventNotificationService.NotifyEventAttendanceChangedAsync(eventId, userId, userName, attendanceType);
        }

        // Discussion Notifications
        public async Task NotifyDiscussionCreatedAsync(Guid groupId, Guid discussionId, string discussionTitle, Guid creatorId, string creatorName)
        {
            await SendEnhancedNotificationAsync(groupId.ToString(), "New Discussion", $"{creatorName} started a new discussion: {discussionTitle}", "Info", "Medium", "Discussions", null, discussionId, "Discussion");
        }

        public async Task NotifyDiscussionReplyAsync(Guid groupId, Guid discussionId, string discussionTitle, Guid replyerId, string replierName)
        {
            await SendEnhancedNotificationAsync(groupId.ToString(), "Discussion Reply", $"{replierName} replied to discussion: {discussionTitle}", "Info", "Low", "Discussions", null, discussionId, "Discussion");
        }

        public async Task NotifyDiscussionPinnedAsync(Guid groupId, Guid discussionId, string discussionTitle)
        {
            await SendEnhancedNotificationAsync(groupId.ToString(), "Discussion Pinned", $"Discussion '{discussionTitle}' has been pinned", "Info", "Medium", "Discussions", null, discussionId, "Discussion");
        }

        public async Task NotifyDiscussionLockedAsync(Guid groupId, Guid discussionId, string discussionTitle, string reason)
        {
            await SendEnhancedNotificationAsync(groupId.ToString(), "Discussion Locked", $"Discussion '{discussionTitle}' has been locked. Reason: {reason}", "Warning", "Medium", "Discussions", null, discussionId, "Discussion");
        }

        public async Task NotifyDiscussionUnlockedAsync(Guid groupId, Guid discussionId, string discussionTitle)
        {
            await SendEnhancedNotificationAsync(groupId.ToString(), "Discussion Unlocked", $"Discussion '{discussionTitle}' has been unlocked", "Info", "Medium", "Discussions", null, discussionId, "Discussion");
        }

        // Real-time Updates
        public async Task SendGroupUpdateAsync(Guid groupId, object updateData)
        {
            await _groupNotificationService.SendGroupUpdateAsync(groupId, updateData);
        }

        public async Task SendEventUpdateAsync(Guid eventId, object updateData)
        {
            await _eventNotificationService.SendEventUpdateAsync(eventId, updateData);
        }

        public async Task SendDiscussionUpdateAsync(Guid discussionId, object updateData)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"discussion_{discussionId}", updateData);
                _logger.LogInformation("Discussion update sent to discussion {DiscussionId}", discussionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send discussion update to discussion {DiscussionId}", discussionId);
            }
        }

        public async Task SendUserNotificationAsync(Guid userId, object notificationData)
        {
            try
            {
                await _hubService.SendNotificationToUserAsync(userId.ToString(), notificationData);
                _logger.LogInformation("User notification sent to user {UserId}", userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send user notification to user {UserId}", userId);
            }
        }

        public async Task SendGroupMembersUpdateAsync(Guid groupId, object updateData)
        {
            await _groupNotificationService.SendGroupMembersUpdateAsync(groupId, updateData);
        }

        // Bulk Notification Methods
        public async Task NotifyGroupMembersAsync(Guid groupId, string message, object? data = null)
        {
            await _groupNotificationService.NotifyGroupMembersAsync(groupId, message, data);
        }

        public async Task NotifyEventAttendeesAsync(Guid eventId, string message, object? data = null)
        {
            await _eventNotificationService.NotifyEventAttendeesAsync(eventId, message, data);
        }

        public async Task NotifyDiscussionParticipantsAsync(Guid discussionId, string message, object? data = null)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"discussion_{discussionId}", new { message, data });
                _logger.LogInformation("Notification sent to all participants of discussion {DiscussionId}", discussionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to notify discussion participants of discussion {DiscussionId}", discussionId);
            }
        }

        // System Notification Methods
        public async Task NotifySystemMaintenanceAsync(DateTime maintenanceTime, string message)
        {
            await _systemNotificationService.NotifySystemMaintenanceAsync(maintenanceTime, message);
        }

        public async Task NotifySystemUpdateAsync(string version, string updateNotes)
        {
            await _systemNotificationService.NotifySystemUpdateAsync(version, updateNotes);
        }

        // Event Comment Notification Methods
        public async Task SendEventCommentNotificationAsync(Guid organizerId, Guid eventId, string eventTitle, Guid commenterId, string commentContent)
        {
            await _eventNotificationService.SendEventCommentNotificationAsync(organizerId, eventId, eventTitle, commenterId, commentContent);
        }

        public async Task SendEventCommentReplyNotificationAsync(Guid parentCommenterId, Guid eventId, string eventTitle, Guid replierId, string replyContent)
        {
            await _eventNotificationService.SendEventCommentReplyNotificationAsync(parentCommenterId, eventId, eventTitle, replierId, replyContent);
        }

        // Event Update Notifications
        public async Task SendEventUpdateNotificationAsync(Guid userId, Guid eventId, string eventTitle, string updateContent)
        {
            await SendEnhancedNotificationAsync(userId.ToString(), "Event Update", $"Event '{eventTitle}' has been updated: {updateContent}", "Info", "Medium", "Events", null, eventId, "Event");
        }

        // Private helper method
        private async Task SendEnhancedNotificationAsync(string userId, string title, string message, string type, string priority, string category, string? targetUrl = null, Guid? relatedEntityId = null, string? relatedEntityType = null, Guid? sourceUserId = null)
        {
            if (!Guid.TryParse(userId, out var userGuid)) return;

            var notification = new Notification
            {
                UserId = userGuid,
                Title = title,
                Message = message,
                Type = type,
                Priority = priority,
                Category = category,
                TargetUrl = targetUrl,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                SourceUserId = sourceUserId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification);
            
            _logger.LogInformation("Sending {Category} notification to user {UserId}: {Title} (Priority: {Priority})", category, userId, title, priority);

            try
            {
                var notificationData = new
                {
                    id = notification.Id.ToString(),
                    title = notification.Title,
                    message = notification.Message,
                    type = notification.Type,
                    priority = notification.Priority,
                    category = notification.Category,
                    createdAt = notification.CreatedAt,
                    isRead = notification.IsRead,
                    targetUrl = notification.TargetUrl,
                    relatedEntityId = notification.RelatedEntityId?.ToString(),
                    relatedEntityType = notification.RelatedEntityType,
                    sourceUserId = notification.SourceUserId?.ToString()
                };

                await _hubService.SendNotificationToUserAsync(userId, notificationData);
                
                if (priority == "High" || priority == "Critical")
                {
                    await _hubService.SendNotificationToGroupAsync($"priority_{priority.ToLower()}", notificationData);
                }
                
                _logger.LogInformation("Real-time notification sent successfully to user {UserId}", userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send real-time notification to user {UserId}, but notification was saved", userId);
            }
        }
    }
}
