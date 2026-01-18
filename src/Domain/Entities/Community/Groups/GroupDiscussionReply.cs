using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupDiscussionReply : BaseAuditableEntity
    {
        public Guid DiscussionId { get; set; }
        public Guid? ParentReplyId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int LikeCount { get; set; } = 0;
        public bool IsDeleted { get; set; } = false;

        // Foreign Keys
        public Guid CreatedBy { get; set; }

        // Navigation Properties
        public virtual GroupDiscussion Discussion { get; set; } = null!;
        public virtual ApplicationUser Creator { get; set; } = null!;
        public virtual GroupDiscussionReply? ParentReply { get; set; }
        public virtual ICollection<GroupDiscussionReply> ChildReplies { get; set; } = new List<GroupDiscussionReply>();
    }
}