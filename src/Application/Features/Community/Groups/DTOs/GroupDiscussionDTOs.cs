using Application.Common.DTOs;

namespace Application.Features.Community.Groups.DTOs
{
    // Discussion DTOs
    public class GroupDiscussionDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
        public bool IsPinned { get; set; }
        public bool IsLocked { get; set; }
        public string? LockReason { get; set; }
        public DateTime? LockedUntil { get; set; }
        public bool IsPoll { get; set; }
        public List<PollOptionDto> PollOptions { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? LastActivity { get; set; }
        public GroupMemberDto CreatedBy { get; set; } = new();
        public GroupMemberDto? LockedBy { get; set; }
        public DiscussionStatsDto Stats { get; set; } = new();
        public List<DiscussionReplyDto> RecentReplies { get; set; } = new();
    }

    public class GroupDiscussionSummaryDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
        public bool IsPinned { get; set; }
        public bool IsLocked { get; set; }
        public bool IsPoll { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastActivity { get; set; }
        public GroupMemberDto CreatedBy { get; set; } = new();
        public int ReplyCount { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public bool HasUserReplied { get; set; }
        public bool HasUserLiked { get; set; }
    }

    public class DiscussionReplyDto
    {
        public Guid Id { get; set; }
        public Guid DiscussionId { get; set; }
        public Guid? ParentReplyId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public GroupMemberDto CreatedBy { get; set; } = new();
        public int LikeCount { get; set; }
        public bool HasUserLiked { get; set; }
        public List<DiscussionReplyDto> ChildReplies { get; set; } = new();
        public bool IsEdited { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class PollOptionDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int VoteCount { get; set; }
        public double VotePercentage { get; set; }
        public bool HasUserVoted { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class DiscussionStatsDto
    {
        public int ReplyCount { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public int ParticipantCount { get; set; }
        public DateTime? LastReplyAt { get; set; }
        public GroupMemberDto? LastReplyBy { get; set; }
        public double EngagementScore { get; set; }
    }

    public class DiscussionCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = string.Empty;
        public int DiscussionCount { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }

    // Request DTOs
    public class CreateGroupDiscussionRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
        public bool IsPoll { get; set; } = false;
        public List<string>? PollOptions { get; set; }
        public bool AllowMultipleVotes { get; set; } = false;
        public DateTime? PollExpiresAt { get; set; }
    }

    public class UpdateGroupDiscussionRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
    }

    public class CreateDiscussionReplyRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? ParentReplyId { get; set; }
    }

    public class UpdateDiscussionReplyRequest
    {
        public string Content { get; set; } = string.Empty;
    }

    public class LockDiscussionRequest
    {
        public string Reason { get; set; } = string.Empty;
        public DateTime? LockUntil { get; set; }
    }

    public class VotePollRequest
    {
        public List<Guid> OptionIds { get; set; } = new();
    }

    // Pagination DTOs
    public class GroupDiscussionsPagedResponse : PaginatedResponseDto<GroupDiscussionSummaryDto>
    {
        public Dictionary<string, int> CategoryCounts { get; set; } = new();
        public DiscussionOverallStatsDto Stats { get; set; } = new();
    }

    public class DiscussionRepliesPagedResponse : PaginatedResponseDto<DiscussionReplyDto>
    {
        public DiscussionStatsDto Stats { get; set; } = new();
    }

    public class DiscussionOverallStatsDto
    {
        public int TotalDiscussions { get; set; }
        public int ActiveDiscussions { get; set; }
        public int PinnedDiscussions { get; set; }
        public int LockedDiscussions { get; set; }
        public int PollDiscussions { get; set; }
        public int TotalReplies { get; set; }
        public int TotalParticipants { get; set; }
        public double AverageRepliesPerDiscussion { get; set; }
        public DateTime? LastActivity { get; set; }
    }
}