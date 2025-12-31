using Domain.Base;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace
{
    public class ServiceProviderSpecialty : BaseAuditableEntity
    {
        public ServiceType ServiceType { get; set; }
        public string? Description { get; set; }
        public int ExperienceYears { get; set; } = 0;
        public string? Certifications { get; set; }

        // Foreign Keys
        public Guid ServiceProviderId { get; set; }

        // Navigation Properties
        public virtual ServiceProvider ServiceProvider { get; set; } = null!;
    }
}