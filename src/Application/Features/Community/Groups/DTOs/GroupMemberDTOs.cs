using Application.Common.DTOs;

namespace Application.Features.Community.Groups.DTOs
{
    // Member Management DTOs
    public class InviteMemberRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Message { get; set; }
        public string Role { get; set; } = "Member";
        public DateTime? ExpiresAt { get; set; }
    }

    public class BulkInviteMembersRequest
    {
        public List<string> Emails { get; set; } = new();
        public string? Message { get; set; }
        public string Role { get; set; } = "Member";
    }

    public class UpdateMemberRoleRequest
    {
        public string NewRole { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class PromoteMemberRequest
    {
        public string NewRole { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class DemoteMemberRequest
    {
        public string NewRole { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class RemoveMemberRequest
    {
        public string? Reason { get; set; }
        public bool NotifyMember { get; set; } = true;
    }

    public class BanMemberRequest
    {
        public string Reason { get; set; } = string.Empty;
        public DateTime? BanUntil { get; set; }
        public bool DeletePosts { get; set; } = false;
    }

    public class ApproveJoinRequestRequest
    {
        public string? WelcomeMessage { get; set; }
    }

    public class RejectJoinRequestRequest
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class TransferOwnershipRequest
    {
        public Guid NewOwnerId { get; set; }
        public string? TransferReason { get; set; }
        public bool ConfirmTransfer { get; set; } = false;
    }

    // Response DTOs
    public class GroupInvitationDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Message { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime InvitedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public GroupMemberDto InvitedBy { get; set; } = new();
    }

    public class GroupJoinRequestDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public GroupMemberDto User { get; set; } = new();
        public string Message { get; set; } = string.Empty;
        public string? AdditionalInfo { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public GroupMemberDto? ProcessedBy { get; set; }
        public string? ProcessingReason { get; set; }
    }

    public class BannedMemberDto
    {
        public Guid Id { get; set; }
        public GroupMemberDto Member { get; set; } = new();
        public string Reason { get; set; } = string.Empty;
        public DateTime BannedAt { get; set; }
        public DateTime? BanUntil { get; set; }
        public GroupMemberDto BannedBy { get; set; } = new();
        public bool IsActive { get; set; }
    }

    public class MembershipStatsDto
    {
        public int TotalMembers { get; set; }
        public int ActiveMembers { get; set; }
        public int OnlineMembers { get; set; }
        public int PendingInvitations { get; set; }
        public int PendingJoinRequests { get; set; }
        public int BannedMembers { get; set; }
        public Dictionary<string, int> MembersByRole { get; set; } = new();
        public Dictionary<string, int> MembersJoinedByMonth { get; set; } = new();
        public double MemberRetentionRate { get; set; }
        public double AverageEngagementScore { get; set; }
    }

    public class BulkInviteResultDto
    {
        public int TotalInvitations { get; set; }
        public int SuccessfulInvitations { get; set; }
        public int FailedInvitations { get; set; }
        public List<string> SuccessfulEmails { get; set; } = new();
        public List<BulkInviteErrorDto> Errors { get; set; } = new();
    }

    public class BulkInviteErrorDto
    {
        public string Email { get; set; } = string.Empty;
        public string Error { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
    }

    // Pagination DTOs
    public class GroupMembersPagedResponse : PaginatedResponseDto<GroupMemberDto>
    {
        public Dictionary<string, int> RoleCounts { get; set; } = new();
        public MembershipStatsDto Stats { get; set; } = new();
    }

    public class GroupInvitationsPagedResponse : PaginatedResponseDto<GroupInvitationDto>
    {
        public Dictionary<string, int> StatusCounts { get; set; } = new();
    }

    public class GroupJoinRequestsPagedResponse : PaginatedResponseDto<GroupJoinRequestDto>
    {
        public Dictionary<string, int> StatusCounts { get; set; } = new();
    }
}