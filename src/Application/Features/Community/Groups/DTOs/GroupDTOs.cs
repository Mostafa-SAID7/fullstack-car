using Application.Common.DTOs;

namespace Application.Features.Community.Groups.DTOs
{
    // Response DTOs
    public class GroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public int MemberCount { get; set; }
        public int PostCount { get; set; }
        public int EventCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastActivity { get; set; }
        public GroupOwnerDto Owner { get; set; } = new();
        public List<GroupModeratorDto> Moderators { get; set; } = new();
        public GroupMembershipStatusDto? MembershipStatus { get; set; }
        public GroupSettingsDto Settings { get; set; } = new();
        public GroupStatsDto Stats { get; set; } = new();
    }

    public class GroupSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public int MemberCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsMember { get; set; }
        public bool IsFeatured { get; set; }
    }

    public class GroupOwnerDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    public class GroupModeratorDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime AppointedAt { get; set; }
    }

    public class GroupMemberDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime JoinedAt { get; set; }
        public DateTime? LastActivity { get; set; }
        public bool IsOnline { get; set; }
        public int PostCount { get; set; }
        public int ReputationScore { get; set; }
    }

    public class GroupMembershipStatusDto
    {
        public bool IsMember { get; set; }
        public bool IsPendingApproval { get; set; }
        public bool IsBanned { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime? JoinedAt { get; set; }
        public DateTime? BannedUntil { get; set; }
        public string? BanReason { get; set; }
    }

    public class GroupSettingsDto
    {
        public bool RequireApprovalToJoin { get; set; }
        public bool AllowMemberInvites { get; set; }
        public bool AllowMemberPosts { get; set; }
        public bool AllowMemberEvents { get; set; }
        public bool AllowMemberDiscussions { get; set; }
        public string PostApprovalLevel { get; set; } = string.Empty;
        public int MaxMembersPerInvite { get; set; }
        public bool EnableNotifications { get; set; }
    }

    public class GroupStatsDto
    {
        public int TotalMembers { get; set; }
        public int ActiveMembers { get; set; }
        public int TotalPosts { get; set; }
        public int TotalEvents { get; set; }
        public int TotalDiscussions { get; set; }
        public int PostsThisWeek { get; set; }
        public int NewMembersThisWeek { get; set; }
        public double EngagementRate { get; set; }
        public DateTime? LastActivity { get; set; }
    }

    public class GroupCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public int GroupCount { get; set; }
        public bool IsActive { get; set; }
    }

    // Request DTOs
    public class CreateGroupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = true;
        public bool RequireApprovalToJoin { get; set; } = false;
        public bool AllowMemberInvites { get; set; } = true;
        public bool AllowMemberPosts { get; set; } = true;
        public bool AllowMemberEvents { get; set; } = true;
        public bool AllowMemberDiscussions { get; set; } = true;
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class UpdateGroupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public bool RequireApprovalToJoin { get; set; }
        public bool AllowMemberInvites { get; set; }
        public bool AllowMemberPosts { get; set; }
        public bool AllowMemberEvents { get; set; }
        public bool AllowMemberDiscussions { get; set; }
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class JoinGroupRequest
    {
        public string? Message { get; set; }
    }

    public class LeaveGroupRequest
    {
        public string? Reason { get; set; }
    }

    public class JoinRequestRequest
    {
        public string Message { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; }
    }

    public class ModerateGroupRequest
    {
        public string Action { get; set; } = string.Empty; // Suspend, Activate, Feature, etc.
        public string Reason { get; set; } = string.Empty;
        public DateTime? ActionUntil { get; set; }
    }

    public class FeatureGroupRequest
    {
        public string? Reason { get; set; }
        public DateTime? FeaturedUntil { get; set; }
        public int Priority { get; set; } = 1;
    }

    // Pagination DTOs
    public class GroupsPagedResponse : PaginatedResponseDto<GroupSummaryDto>
    {
        public Dictionary<string, int> CategoryCounts { get; set; } = new();
        public GroupsStatsDto Stats { get; set; } = new();
    }

    public class GroupsStatsDto
    {
        public int TotalGroups { get; set; }
        public int PublicGroups { get; set; }
        public int PrivateGroups { get; set; }
        public int ActiveGroups { get; set; }
        public int FeaturedGroups { get; set; }
        public int TotalMembers { get; set; }
        public int NewGroupsThisWeek { get; set; }
    }
}