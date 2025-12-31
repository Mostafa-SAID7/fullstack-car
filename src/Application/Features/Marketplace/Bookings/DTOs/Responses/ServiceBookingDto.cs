using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Bookings.DTOs.Responses
{
    public class ServiceBookingDto
    {
        public Guid Id { get; set; }
        public string BookingNumber { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public TimeSpan ScheduledTime { get; set; }
        public DateTime ScheduledDateTime { get; set; }
        public BookingStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
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
        public bool IsEmergency { get; set; }
        public string? EmergencyDetails { get; set; }
        public DateTime CreatedAt { get; set; }

        // Customer Info
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }

        // Service Info
        public Guid ServiceId { get; set; }
        public string ServiceTitle { get; set; } = string.Empty;
        public ServiceType ServiceType { get; set; }
        public string ServiceTypeName { get; set; } = string.Empty;

        // Provider Info
        public Guid ServiceProviderId { get; set; }
        public string ServiceProviderName { get; set; } = string.Empty;
        public string? ServiceProviderPhone { get; set; }

        // Payment Info
        public PaymentStatus? PaymentStatus { get; set; }
        public string? PaymentStatusName { get; set; }
        public DateTime? PaidAt { get; set; }

        // Review Info
        public bool HasReview { get; set; }
        public int? ReviewRating { get; set; }
    }
}