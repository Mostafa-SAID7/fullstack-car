using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class File : BaseAuditableEntity
    {
        public string FileName { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty; // MIME type
        public long Size { get; set; }
        public string Extension { get; set; } = string.Empty;
        
        // Generic Content Reference
        public ContentType? RelatedContentType { get; set; }
        public Guid? RelatedContentId { get; set; }

        public Guid? UserId { get; set; }
        public virtual ApplicationUser? User { get; set; }
    }
}
