using Domain.Base;
using Domain.Enums.Community.Pages;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Pages
{
    public class Page : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public PageStatus Status { get; set; } = PageStatus.Draft;
        public PageType Type { get; set; } = PageType.Static;
        public string? Template { get; set; }
        public string? FeaturedImageUrl { get; set; }
        public DateTime? PublishedAt { get; set; }
        public int ViewsCount { get; set; } = 0;
        public int SortOrder { get; set; } = 0;
        public bool IsHomepage { get; set; } = false;
        public bool ShowInMenu { get; set; } = true;
        public bool AllowComments { get; set; } = false;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? CustomCss { get; set; }
        public string? CustomJs { get; set; }

        // Foreign Keys
        public Guid AuthorId { get; set; }
        public Guid? ParentPageId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Author { get; set; } = null!;
        public virtual Page? ParentPage { get; set; }
        public virtual ICollection<Page> ChildPages { get; set; } = new List<Page>();
        public virtual ICollection<PageContent> Contents { get; set; } = new List<PageContent>();
        public virtual ICollection<PageRevision> Revisions { get; set; } = new List<PageRevision>();
        public virtual ICollection<PageView> Views { get; set; } = new List<PageView>();
        public virtual ICollection<PageComment> Comments { get; set; } = new List<PageComment>();
    }
}