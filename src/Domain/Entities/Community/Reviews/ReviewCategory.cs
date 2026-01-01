using Domain.Base;

namespace Domain.Entities.Community.Reviews
{
    public class ReviewCategory : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000";
        public int ReviewsCount { get; set; } = 0;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Foreign Keys
        public Guid? ParentCategoryId { get; set; }

        // Navigation Properties
        public virtual ReviewCategory? ParentCategory { get; set; }
        public virtual ICollection<ReviewCategory> SubCategories { get; set; } = new List<ReviewCategory>();
        public virtual ICollection<CommunityReview> Reviews { get; set; } = new List<CommunityReview>();
    }
}