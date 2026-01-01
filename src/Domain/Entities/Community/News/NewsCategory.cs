using Domain.Base;

namespace Domain.Entities.Community.News
{
    public class NewsCategory : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000";
        public int ArticlesCount { get; set; } = 0;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool ShowOnHomepage { get; set; } = true;

        // Foreign Keys
        public Guid? ParentCategoryId { get; set; }

        // Navigation Properties
        public virtual NewsCategory? ParentCategory { get; set; }
        public virtual ICollection<NewsCategory> SubCategories { get; set; } = new List<NewsCategory>();
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}