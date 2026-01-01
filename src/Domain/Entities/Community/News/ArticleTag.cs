using Domain.Base;

namespace Domain.Entities.Community.News
{
    public class ArticleTag : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = "#007bff";
        public int UsageCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}