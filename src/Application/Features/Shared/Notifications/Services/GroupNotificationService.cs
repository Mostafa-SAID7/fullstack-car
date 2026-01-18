using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class GroupNotificationService : BaseNotificationService, IGroupNotificationService
    {
        public GroupNotificationService(
            ILogger<BaseNotificationService> logger,
            IRepository<Notification> notificationRepository,
            INotificationHubService hubService)
            : base(logger, notificationRepository, hubService)
        {
        }

        public async Task NotifyGroupMemberJoinedAsync(Guid groupId, Guid userId, string userName)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "New Group Member", 
                $"{userName} has joined the group", 
                "Info", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupMemberLeftAsync(Guid groupId, Guid userId, string userName)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Member Left Group", 
                $"{userName} has left the group", 
                "Info", 
                "Low", 
                "Groups");
        }

        public async Task NotifyGroupMemberBannedAsync(Guid groupId, Guid userId, string userName, string reason)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Member Banned", 
                $"{userName} has been banned from the group. Reason: {reason}", 
                "Warning", 
                "High", 
                "Groups");
        }

        public async Task NotifyGroupMemberUnbannedAsync(Guid groupId, Guid userId, string userName)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Member Unbanned", 
                $"{userName} has been unbanned from the group", 
                "Info", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupMemberRoleChangedAsync(Guid groupId, Guid userId, string userName, string newRole)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Role Changed", 
                $"{userName}'s role has been changed to {newRole}", 
                "Info", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupJoinRequestAsync(Guid groupId, Guid userId, string userName)
        {
            await SendEnhancedNotificationAsync(
                groupId.ToString(), 
                "Join Request", 
                $"{userName} has requested to join the group", 
                "Info", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupJoinRequestApprovedAsync(Guid groupId, Guid userId, string groupName)
        {
            await SendEnhancedNotificationAsync(
                userId.ToString(), 
                "Join Request Approved", 
                $"Your request to join {groupName} has been approved", 
                "Success", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupJoinRequestRejectedAsync(Guid groupId, Guid userId, string groupName, string reason)
        {
            await SendEnhancedNotificationAsync(
                userId.ToString(), 
                "Join Request Rejected", 
                $"Your request to join {groupName} has been rejected. Reason: {reason}", 
                "Warning", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupInvitationAsync(Guid userId, string inviterName, string groupName, string message)
        {
            await SendEnhancedNotificationAsync(
                userId.ToString(), 
                "Group Invitation", 
                $"{inviterName} has invited you to join {groupName}. {message}", 
                "Info", 
                "Medium", 
                "Groups");
        }

        public async Task NotifyGroupOwnershipTransferredAsync(Guid groupId, Guid oldOwnerId, Guid newOwnerId, string groupName)
        {
            await SendEnhancedNotificationAsync(
                newOwnerId.ToString(), 
                "Group Ownership Transferred", 
                $"You are now the owner of {groupName}", 
                "Success", 
                "High", 
                "Groups");

            await SendEnhancedNotificationAsync(
                oldOwnerId.ToString(), 
                "Group Ownership Transferred", 
                $"Ownership of {groupName} has been transferred", 
                "Info", 
                "Medium", 
                "Groups");
        }

        public async Task SendGroupUpdateAsync(Guid groupId, object updateData)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"group_{groupId}", updateData);
                _logger.LogInformation("Group update sent to group {GroupId}", groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send group update to group {GroupId}", groupId);
            }
        }

        public async Task SendGroupMembersUpdateAsync(Guid groupId, object updateData)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"group_members_{groupId}", updateData);
                _logger.LogInformation("Group members update sent to group {GroupId}", groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send group members update to group {GroupId}", groupId);
            }
        }

        public async Task NotifyGroupMembersAsync(Guid groupId, string message, object? data = null)
        {
            try
            {
                await _hubService.SendNotificationToGroupAsync($"group_{groupId}", new { message, data });
                _logger.LogInformation("Notification sent to all members of group {GroupId}", groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to notify group members of group {GroupId}", groupId);
            }
        }
    }
}