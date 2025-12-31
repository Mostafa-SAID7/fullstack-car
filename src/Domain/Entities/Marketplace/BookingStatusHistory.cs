using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace
{
    public class BookingStatusHistory : BaseAuditableEntity
    {
        public BookingStatus FromStatus { get; set; }
        public BookingStatus ToStatus { get; set; }
        public string? Notes { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid BookingId { get; set; }
        public Guid ChangedById { get; set; }

        // Navigation Properties
        public virtual ServiceBooking Booking { get; set; } = null!;
        public virtual ApplicationUser ChangedBy { get; set; } = null!;
    }
}