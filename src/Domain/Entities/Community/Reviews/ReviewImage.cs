using Domain.Base;

namespace Domain.Entities.Community.Reviews
{
    public class ReviewImage : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Foreign Keys
        public Guid ReviewId { get; set; }

        // Navigation Properties
        public virtual CommunityReview Review { get; set; } = null!;
    }
}