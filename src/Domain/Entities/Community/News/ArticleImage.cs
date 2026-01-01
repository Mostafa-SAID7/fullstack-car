using Domain.Base;

namespace Domain.Entities.Community.News
{
    public class ArticleImage : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public string? AltText { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Foreign Keys
        public Guid ArticleId { get; set; }

        // Navigation Properties
        public virtual Article Article { get; set; } = null!;
    }
}