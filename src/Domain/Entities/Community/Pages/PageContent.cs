using Domain.Base;
using Domain.Enums.Community.Pages;

namespace Domain.Entities.Community.Pages
{
    public class PageContent : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public PageContentType Type { get; set; } = PageContentType.Text;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public string? Settings { get; set; } // JSON for component settings

        // Foreign Keys
        public Guid PageId { get; set; }

        // Navigation Properties
        public virtual Page Page { get; set; } = null!;
    }
}