using Domain.DomainEvents;

namespace Domain.DomainEvents.Community.News
{
    public class ArticlePublishedEvent : BaseDomainEvent
    {
        public Guid ArticleId { get; set; }
        public Guid AuthorId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public bool IsFeatured { get; set; }

        public ArticlePublishedEvent(Guid articleId, Guid authorId, string title, string slug, Guid categoryId, bool isFeatured)
        {
            ArticleId = articleId;
            AuthorId = authorId;
            Title = title;
            Slug = slug;
            CategoryId = categoryId;
            IsFeatured = isFeatured;
        }
    }
}
