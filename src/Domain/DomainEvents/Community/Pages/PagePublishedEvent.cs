using Domain.DomainEvents;

namespace Domain.DomainEvents.Community.Pages
{
    public class PagePublishedEvent : BaseDomainEvent
    {
        public Guid PageId { get; set; }
        public Guid AuthorId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsHomepage { get; set; }

        public PagePublishedEvent(Guid pageId, Guid authorId, string title, string slug, bool isHomepage)
        {
            PageId = pageId;
            AuthorId = authorId;
            Title = title;
            Slug = slug;
            IsHomepage = isHomepage;
        }
    }
}
