using Domain.Base;

namespace Domain.Entities.Shared.Localization
{
    public class TranslationCompleteness : BaseAuditableEntity
    {
        public string Culture { get; set; } = string.Empty;
        public string Feature { get; set; } = string.Empty;
        public int TotalKeys { get; set; }
        public int TranslatedKeys { get; set; }
        public decimal CompletionPercentage { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}