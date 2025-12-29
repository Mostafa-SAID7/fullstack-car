using Domain.Base;
using Domain.Enums;
using System.Collections.Generic;
using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;

namespace Domain.Entities.Community.Groups
{
    public class Group : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public GroupType Type { get; set; }
        public GroupPrivacy Privacy { get; set; } = GroupPrivacy.Public;
        public int MembersCount { get; set; } = 0;
        public int PostsCount { get; set; } = 0;

        // Foreign Keys
        public Guid OwnerId { get; set; }

        // Navigation Properties
        public virtual User Owner { get; set; } = null!;
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
    }
}
