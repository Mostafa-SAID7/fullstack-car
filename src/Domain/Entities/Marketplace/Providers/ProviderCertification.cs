namespace Domain.Entities.Marketplace.Providers;

public class ProviderCertification : BaseEntity
{
    public Guid ServiceProviderId { get; set; }
    public string CertificationName { get; set; } = string.Empty;
    public string IssuingOrganization { get; set; } = string.Empty;
    public string? CertificationNumber { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    public string? DocumentUrl { get; set; }
    public string? Description { get; set; }
    public string? VerificationNotes { get; set; }

    // Navigation properties
    public ServiceProvider ServiceProvider { get; set; } = null!;
}