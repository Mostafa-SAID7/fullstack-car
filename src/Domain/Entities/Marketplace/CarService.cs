using Domain.Base;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace
{
    public class CarService : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ServiceType Type { get; set; }
        public ServiceStatus Status { get; set; } = ServiceStatus.Draft;
        public decimal BasePrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public int EstimatedDurationMinutes { get; set; }
        public bool IsEmergencyService { get; set; } = false;
        public bool IsAvailable24x7 { get; set; } = false;
        public string? ImageUrl { get; set; }
        public string? Requirements { get; set; }
        public string? IncludedItems { get; set; }
        public string? ExcludedItems { get; set; }
        public decimal AverageRating { get; set; } = 0;
        public int TotalReviews { get; set; } = 0;
        public int TotalBookings { get; set; } = 0;
        public DateTime? LastBookedAt { get; set; }

        // Foreign Keys
        public Guid ServiceProviderId { get; set; }

        // Navigation Properties
        public virtual ServiceProvider ServiceProvider { get; set; } = null!;
        public virtual ICollection<ServiceBooking> Bookings { get; set; } = new List<ServiceBooking>();
        public virtual ICollection<ServiceReview> Reviews { get; set; } = new List<ServiceReview>();
        public virtual ICollection<ServiceImage> Images { get; set; } = new List<ServiceImage>();
        public virtual ICollection<ServiceAvailability> Availability { get; set; } = new List<ServiceAvailability>();
    }
}