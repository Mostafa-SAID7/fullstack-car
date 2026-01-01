using Domain.Base;

namespace Domain.Entities.Community.Maps
{
    public class ReviewImage : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int SortOrder { get; set; } = 0;

        // Foreign Keys
        public Guid ReviewId { get; set; }

        // Navigation Properties
        public virtual PlaceReview Review { get; set; } = null!;
    }
}