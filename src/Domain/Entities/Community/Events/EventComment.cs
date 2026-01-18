using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Events
{
    public class EventComment : BaseAuditableEntity
    {
        public Guid EventId { get; set; }
        public Guid? ParentCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int LikeCount { get; set; } = 0;
        public new bool IsDeleted { get; set; } = false;
        public bool IsEdited { get; set; } = false;

        // Navigation Properties
        public virtual Event Event { get; set; } = null!;
        public virtual EventComment? ParentComment { get; set; }
        public virtual ICollection<EventComment> ChildComments { get; set; } = new List<EventComment>();
        public virtual ApplicationUser CreatedByUser { get; set; } = null!;
        public virtual ICollection<EventCommentLike> Likes { get; set; } = new List<EventCommentLike>();
    }
}