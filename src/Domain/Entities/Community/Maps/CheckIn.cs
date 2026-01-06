using Domain.Base;
using Domain.Enums.Community.Maps;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Maps
{
    public class CheckIn : BaseEntity
    {
        public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
        public string? Comment { get; set; }
        public string? ImageUrl { get; set; }
        public CheckInPrivacy Privacy { get; set; } = CheckInPrivacy.Public;
        public bool IsActive { get; set; } = true;
        public int LikesCount { get; set; } = 0;
        public int CommentsCount { get; set; } = 0;

        // Foreign Keys
        public Guid LocationId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Location Location { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ICollection<CheckInLike> Likes { get; set; } = new List<CheckInLike>();
        public virtual ICollection<CheckInComment> Comments { get; set; } = new List<CheckInComment>();
    }
}
