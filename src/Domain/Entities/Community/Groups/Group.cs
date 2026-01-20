using Domain.Base;
using Domain.Enums.Community;
using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;

namespace Domain.Entities.Community.Groups
{
    public class Group : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Type { get; set; } = "Public"; // Public, Private, Secret
        public string Privacy { get; set; } = "Open"; // Open, Closed, Secret
        public bool IsPublic { get; set; } = true;
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        public int MemberCount { get; set; } = 0;
        public int PostCount { get; set; } = 0;
        public int EventCount { get; set; } = 0;
        public DateTime? LastActivity { get; set; }

        // Generic Content Reference
        public Domain.Enums.Common.ContentType? TargetContentType { get; set; }
        public Guid? TargetId { get; set; }

        // Foreign Keys
        public Guid OwnerId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Owner { get; set; } = null!;
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
        public virtual ICollection<GroupEvent> Events { get; set; } = new List<GroupEvent>();
        public virtual ICollection<GroupDiscussion> Discussions { get; set; } = new List<GroupDiscussion>();
        public virtual ICollection<GroupBan> Bans { get; set; } = new List<GroupBan>();
        public virtual ICollection<GroupJoinRequest> JoinRequests { get; set; } = new List<GroupJoinRequest>();
        public virtual ICollection<GroupInvitation> Invitations { get; set; } = new List<GroupInvitation>();
    }
}
