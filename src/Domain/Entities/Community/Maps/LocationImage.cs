using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Maps
{
    public class LocationImage : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid LocationId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Location Location { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}