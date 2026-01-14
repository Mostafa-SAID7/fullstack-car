using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Shared.Localization
{
    public class TranslationAudit : BaseAuditableEntity
    {
        public string Culture { get; set; } = string.Empty;
        public string Feature { get; set; } = string.Empty;
        public string TranslationKey { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public new Guid? UpdatedBy { get; set; }
        
        // Navigation Properties
        public virtual ApplicationUser? UpdatedByUser { get; set; }
    }
}