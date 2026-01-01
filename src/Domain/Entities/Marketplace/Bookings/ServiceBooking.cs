using Domain.Entities.Identity;
using Domain.Entities.Marketplace.Providers;
using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Payments;
using Domain.Entities.Marketplace.Reviews;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace.Bookings;

public class ServiceBooking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Guid ServiceProviderId { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    
    // Scheduling
    public DateTime BookingDate { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan ScheduledTime { get; set; }
    public TimeSpan? EstimatedDuration { get; set; }
    public DateTime? ActualStartTime { get; set; }
    public DateTime? ActualEndTime { get; set; }
    
    // Status and Tracking
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public Guid? CancelledByUserId { get; set; }
    
    // Financial
    public decimal SubTotal { get; set; }
    public decimal? TaxAmount { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? TipAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? PromoCode { get; set; }
    
    // Location and Details
    public string? CustomerAddress { get; set; }
    public string? CustomerCity { get; set; }
    public string? CustomerState { get; set; }
    public string? CustomerZipCode { get; set; }
    public double? CustomerLatitude { get; set; }
    public double? CustomerLongitude { get; set; }
    
    // Vehicle Information (for car services)
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public int? VehicleYear { get; set; }
    public string? VehicleColor { get; set; }
    public string? VehicleLicensePlate { get; set; }
    public string? VehicleVin { get; set; }
    
    // Notes and Communication
    public string? CustomerNotes { get; set; }
    public string? ProviderNotes { get; set; }
    public string? InternalNotes { get; set; }
    public string? CancellationReason { get; set; }
    public string? CompletionNotes { get; set; }
    
    // Emergency and Priority
    public bool IsEmergency { get; set; } = false;
    public Priority Priority { get; set; } = Priority.Normal;
    public string? EmergencyDetails { get; set; }
    
    // Quality and Follow-up
    public bool IsReviewed { get; set; } = false;
    public bool RequiresFollowUp { get; set; } = false;
    public DateTime? FollowUpDate { get; set; }
    public string? FollowUpNotes { get; set; }

    // Additional properties expected by Infrastructure
    public DateTime ServiceDate { get; set; } // Alias for ScheduledDate
    public string? Notes { get; set; } // Alias for CustomerNotes

    // Navigation properties
    public ApplicationUser Customer { get; set; } = null!;
    public ApplicationUser? CancelledByUser { get; set; }
    public ServiceProvider ServiceProvider { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();
    public ICollection<BookingStatusHistory> StatusHistory { get; set; } = new List<BookingStatusHistory>();
    public ICollection<BookingAttachment> Attachments { get; set; } = new List<BookingAttachment>();
    public ServiceReview? Review { get; set; }
}