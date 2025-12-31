using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace
{
    public class ServiceBooking : BaseAuditableEntity
    {
        public string BookingNumber { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public TimeSpan ScheduledTime { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "USD";
        public string? CustomerNotes { get; set; }
        public string? ProviderNotes { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CustomerAddress { get; set; }
        public double? CustomerLatitude { get; set; }
        public double? CustomerLongitude { get; set; }
        public bool IsEmergency { get; set; } = false;
        public string? EmergencyDetails { get; set; }

        // Foreign Keys
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid ServiceProviderId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Customer { get; set; } = null!;
        public virtual CarService Service { get; set; } = null!;
        public virtual ServiceProvider ServiceProvider { get; set; } = null!;
        public virtual ServicePayment? Payment { get; set; }
        public virtual ServiceReview? Review { get; set; }
        public virtual ICollection<BookingStatusHistory> StatusHistory { get; set; } = new List<BookingStatusHistory>();
    }
}