using Domain.Base;
using Domain.Enums.Community.News;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.News
{
    public class Article : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? FeaturedImageUrl { get; set; }
        public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
        public ArticlePriority Priority { get; set; } = ArticlePriority.Normal;
        public DateTime? PublishedAt { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public int ViewsCount { get; set; } = 0;
        public int LikesCount { get; set; } = 0;
        public int CommentsCount { get; set; } = 0;
        public int SharesCount { get; set; } = 0;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? Tags { get; set; } // JSON array
        public bool IsFeatured { get; set; } = false;
        public bool AllowComments { get; set; } = true;
        public string? Source { get; set; }
        public string? SourceUrl { get; set; }

        // Foreign Keys
        public Guid AuthorId { get; set; }
        public Guid CategoryId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Author { get; set; } = null!;
        public virtual NewsCategory Category { get; set; } = null!;
        public virtual ICollection<NewsComment> Comments { get; set; } = new List<NewsComment>();
        public virtual ICollection<ArticleLike> Likes { get; set; } = new List<ArticleLike>();
        public virtual ICollection<ArticleView> Views { get; set; } = new List<ArticleView>();
        public virtual ICollection<ArticleShare> Shares { get; set; } = new List<ArticleShare>();
        public virtual ICollection<ArticleImage> Images { get; set; } = new List<ArticleImage>();
        public virtual ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }
}
