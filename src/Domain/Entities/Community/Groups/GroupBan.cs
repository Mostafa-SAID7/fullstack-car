using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupBan : BaseEntity
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public Guid BannedBy { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime BannedAt { get; set; } = DateTime.UtcNow;
        public DateTime? BanUntil { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsPermanent { get; set; } = false;
        public DateTime? UnbannedAt { get; set; }
        public Guid? UnbannedBy { get; set; }

        // Navigation Properties
        public virtual Group Group { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationUser BannedByUser { get; set; } = null!;
        public virtual ApplicationUser? UnbannedByUser { get; set; }
    }
}