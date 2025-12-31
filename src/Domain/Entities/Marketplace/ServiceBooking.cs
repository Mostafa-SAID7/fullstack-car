using Domain.Entities.Identity;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace;

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
    public DateTime ServiceDate { get; set; }
    
    // Status and Tracking
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    
    // Financial
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    
    // Location and Details
    public string? CustomerAddress { get; set; }
    public double? CustomerLatitude { get; set; }
    public double? CustomerLongitude { get; set; }
    
    // Notes and Communication
    public string Notes { get; set; } = string.Empty;
    public string? CustomerNotes { get; set; }
    public string? ProviderNotes { get; set; }
    public string? CancellationReason { get; set; }
    
    // Emergency
    public bool IsEmergency { get; set; }
    public string? EmergencyDetails { get; set; }

    // Navigation properties
    public ApplicationUser Customer { get; set; } = null!;
    public ServiceProvider ServiceProvider { get; set; } = null!;
    public CarService Service { get; set; } = null!;
    public ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();
}
