using Domain.Base;

namespace Domain.Entities.Marketplace
{
    public class ServiceImage : BaseAuditableEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? AltText { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;

        // Foreign Keys
        public Guid ServiceId { get; set; }

        // Navigation Properties
        public virtual CarService Service { get; set; } = null!;
    }
}