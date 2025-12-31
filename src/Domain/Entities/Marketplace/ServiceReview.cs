using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Marketplace
{
    public class ServiceReview : BaseAuditableEntity
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public bool IsVerified { get; set; } = false;
        public bool IsPublic { get; set; } = true;
        public string? ProviderResponse { get; set; }
        public DateTime? ProviderResponseDate { get; set; }
        public bool IsRecommended { get; set; } = true;

        // Foreign Keys
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid ServiceProviderId { get; set; }
        public Guid BookingId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Customer { get; set; } = null!;
        public virtual CarService Service { get; set; } = null!;
        public virtual ServiceProvider ServiceProvider { get; set; } = null!;
        public virtual ServiceBooking Booking { get; set; } = null!;
    }
}