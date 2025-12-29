using Domain.Base;
using Domain.Enums.Community.Reviews;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Reviews
{
    public class Review : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; } // 1-5 stars
        public ReviewType Type { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsVerified { get; set; } = false;
        public int HelpfulCount { get; set; } = 0;

        // Foreign Keys
        public Guid UserId { get; set; }
        public string? CarModel { get; set; }
        public string? CarBrand { get; set; }
        public int? CarYear { get; set; }

        // Navigation Properties
        public virtual User User { get; set; } = null!;
    }
}
