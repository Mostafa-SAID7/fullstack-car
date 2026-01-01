using Domain.Entities.Identity;

namespace Domain.Entities.Marketplace.Services;

public class Service : BaseEntity
{
    public Guid ServiceProviderId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int EstimatedDuration { get; set; } // in minutes
    public int? MaxDuration { get; set; }
    public ServiceType ServiceType { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? SubCategory { get; set; }
    public ServiceStatus Status { get; set; } = ServiceStatus.Active;
    public bool IsActive { get; set; } = true;
    public bool IsPopular { get; set; } = false;
    public bool RequiresApproval { get; set; } = false;
    public string? Requirements { get; set; }
    public string? Inclusions { get; set; }
    public string? Exclusions { get; set; }
    public string? Tags { get; set; }
    public int SortOrder { get; set; } = 0;
    public decimal AverageRating { get; set; } = 0;
    public int TotalReviews { get; set; } = 0;
    public int TotalBookings { get; set; } = 0;

    // Navigation properties
    public ServiceProvider ServiceProvider { get; set; } = null!;
    public ICollection<ServiceBooking> Bookings { get; set; } = new List<ServiceBooking>();
    public ICollection<ServiceImage> Images { get; set; } = new List<ServiceImage>();
    public ICollection<ServiceAvailability> Availabilities { get; set; } = new List<ServiceAvailability>();
    public ICollection<ServiceReview> Reviews { get; set; } = new List<ServiceReview>();
    public ICollection<ServicePricing> Pricings { get; set; } = new List<ServicePricing>();
}