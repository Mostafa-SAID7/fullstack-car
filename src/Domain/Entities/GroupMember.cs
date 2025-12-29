using Domain.Base;
using Domain.Enums;

namespace Domain.Entities
{
    public class GroupMember : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
        public GroupMemberRole Role { get; set; } = GroupMemberRole.Member;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Group Group { get; set; } = null!;
    }
}