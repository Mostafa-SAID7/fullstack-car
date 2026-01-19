using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class Image : BaseAuditableEntity
    {
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string. Empty;
        public string? AltText { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public long Size { get; set; }
        
        // Generic Content Reference (optional, if this image belongs to a specific entity)
        public ContentType? ContentType { get; set; }
        public Guid? ContentId { get; set; }

        public Guid? UserId { get; set; }
        public virtual ApplicationUser? User { get; set; }
    }
}
