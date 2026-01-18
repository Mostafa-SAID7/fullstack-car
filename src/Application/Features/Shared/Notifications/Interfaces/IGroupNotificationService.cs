namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface IGroupNotificationService
    {
        // Group Member Notifications
        Task NotifyGroupMemberJoinedAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupMemberLeftAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupMemberBannedAsync(Guid groupId, Guid userId, string userName, string reason);
        Task NotifyGroupMemberUnbannedAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupMemberRoleChangedAsync(Guid groupId, Guid userId, string userName, string newRole);
        Task NotifyGroupJoinRequestAsync(Guid groupId, Guid userId, string userName);
        Task NotifyGroupJoinRequestApprovedAsync(Guid groupId, Guid userId, string groupName);
        Task NotifyGroupJoinRequestRejectedAsync(Guid groupId, Guid userId, string groupName, string reason);
        Task NotifyGroupInvitationAsync(Guid userId, string inviterName, string groupName, string message);
        Task NotifyGroupOwnershipTransferredAsync(Guid groupId, Guid oldOwnerId, Guid newOwnerId, string groupName);

        // Real-time Updates
        Task SendGroupUpdateAsync(Guid groupId, object updateData);
        Task SendGroupMembersUpdateAsync(Guid groupId, object updateData);

        // Bulk Notifications
        Task NotifyGroupMembersAsync(Guid groupId, string message, object? data = null);
    }
}