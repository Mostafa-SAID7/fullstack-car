namespace Domain.Entities.Marketplace.Providers;

public class ServiceProviderSpecialty : BaseEntity
{
    public Guid ServiceProviderId { get; set; }
    public string SpecialtyName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; } = 0;
    public bool IsPrimary { get; set; } = false;
    public string? CertificationLevel { get; set; }
    public DateTime? CertifiedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }

    // Navigation properties
    public ServiceProvider ServiceProvider { get; set; } = null!;
}
