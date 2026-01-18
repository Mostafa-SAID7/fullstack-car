using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupMember : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
        public string Role { get; set; } = "Member";
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastActivity { get; set; }
        public bool IsOnline { get; set; } = false;
        public int PostCount { get; set; } = 0;
        public int ReputationScore { get; set; } = 0;

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Group Group { get; set; } = null!;
    }
}
