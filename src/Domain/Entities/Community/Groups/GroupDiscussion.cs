using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupDiscussion : BaseAuditableEntity
    {
        public Guid GroupId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
        public bool IsPinned { get; set; } = false;
        public bool IsLocked { get; set; } = false;
        public string? LockReason { get; set; }
        public DateTime? LockedUntil { get; set; }
        public bool IsPoll { get; set; } = false;
        public DateTime? LastActivity { get; set; }
        public int ViewCount { get; set; } = 0;
        public int LikeCount { get; set; } = 0;
        public int ReplyCount { get; set; } = 0;

        // Foreign Keys
        public Guid CreatedBy { get; set; }
        public Guid? LockedBy { get; set; }

        // Navigation Properties
        public virtual Group Group { get; set; } = null!;
        public virtual ApplicationUser CreatedByUser { get; set; } = null!;
        public virtual ApplicationUser? LockedByUser { get; set; }
        public virtual ICollection<GroupDiscussionReply> Replies { get; set; } = new List<GroupDiscussionReply>();
        public virtual ICollection<GroupDiscussionPollOption> PollOptions { get; set; } = new List<GroupDiscussionPollOption>();
    }
}