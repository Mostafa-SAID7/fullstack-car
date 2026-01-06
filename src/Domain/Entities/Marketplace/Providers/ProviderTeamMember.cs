namespace Domain.Entities.Marketplace.Providers;

public class ProviderTeamMember : BaseEntity
{
    public Guid ServiceProviderId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Position { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Specialties { get; set; } // JSON array
    public int YearsOfExperience { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    public string? Certifications { get; set; } // JSON array
    public decimal? HourlyRate { get; set; }

    // Navigation properties
    public ServiceProvider ServiceProvider { get; set; } = null!;

    public string FullName => $"{FirstName} {LastName}".Trim();
}
