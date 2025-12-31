using Domain.Base;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace
{
    public class ServicePayment : BaseAuditableEntity
    {
        public string PaymentReference { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public string PaymentMethod { get; set; } = string.Empty;
        public string? PaymentGateway { get; set; }
        public string? TransactionId { get; set; }
        public string? GatewayResponse { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? RefundedAt { get; set; }
        public decimal? RefundAmount { get; set; }
        public string? RefundReason { get; set; }
        public string? FailureReason { get; set; }

        // Foreign Keys
        public Guid BookingId { get; set; }

        // Navigation Properties
        public virtual ServiceBooking Booking { get; set; } = null!;
    }
}