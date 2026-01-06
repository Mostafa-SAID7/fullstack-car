using Domain.Entities.Identity;

using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Bookings;
using Domain.Entities.Marketplace.Reviews;

namespace Domain.Entities.Marketplace.Providers;

public class ServiceProvider : BaseAuditableEntity
{
    public string BusinessName { get; set; } = string.Empty;
    public string? LegalName { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? AlternatePhone { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public decimal AverageRating { get; set; } = 0;
    public int TotalReviews { get; set; } = 0;
    public int TotalBookings { get; set; } = 0;
    public string? BusinessLicense { get; set; }
    public string? TaxId { get; set; }
    public string? InsuranceInfo { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedByUserId { get; set; }
    public string? BusinessHours { get; set; } // JSON
    public string? ServiceAreas { get; set; } // JSON array of areas served
    public decimal? ServiceRadius { get; set; } // in kilometers
    public string? PaymentMethods { get; set; } // JSON array
    public string? Languages { get; set; } // JSON array
    public int YearsInBusiness { get; set; } = 0;
    public int EmployeeCount { get; set; } = 1;
    public bool IsEmergencyProvider { get; set; } = false;
    public bool Is24Hours { get; set; } = false;

    // Foreign Keys
    public Guid OwnerId { get; set; }

    // Navigation Properties
    public ApplicationUser Owner { get; set; } = null!;
    public ApplicationUser? VerifiedByUser { get; set; }
    public ICollection<Service> Services { get; set; } = new List<Service>();
    public ICollection<ServiceBooking> Bookings { get; set; } = new List<ServiceBooking>();
    public ICollection<ServiceReview> Reviews { get; set; } = new List<ServiceReview>();
    public ICollection<ServiceProviderSpecialty> Specialties { get; set; } = new List<ServiceProviderSpecialty>();
    public ICollection<ProviderCertification> Certifications { get; set; } = new List<ProviderCertification>();
    public ICollection<ProviderTeamMember> TeamMembers { get; set; } = new List<ProviderTeamMember>();
}
