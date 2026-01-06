using Domain.Entities.Identity;

using Domain.Entities.Marketplace.Bookings;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace.Payments;

public class PaymentTransaction : BaseEntity
{
    public string TransactionId { get; set; } = string.Empty;
    public string? ExternalTransactionId { get; set; }
    public Guid BookingId { get; set; }
    public Guid PayerId { get; set; }
    public Guid? PayeeId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string PaymentMethod { get; set; } = string.Empty; // Card, Cash, BankTransfer, Wallet
    public string? PaymentProvider { get; set; } // Stripe, PayPal, Square
    public string TransactionType { get; set; } = string.Empty; // Payment, Refund, Partial Refund
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public DateTime? FailedAt { get; set; }
    public string? FailureReason { get; set; }
    public string? Description { get; set; }
    public string? Reference { get; set; }
    public decimal? FeeAmount { get; set; }
    public decimal? NetAmount { get; set; }
    public string? PaymentDetails { get; set; } // JSON for additional payment info
    public string? ReceiptUrl { get; set; }
    public bool IsRefundable { get; set; } = true;
    public decimal? RefundedAmount { get; set; }
    public DateTime? RefundedAt { get; set; }

    // Navigation properties
    public ServiceBooking Booking { get; set; } = null!;
    public ApplicationUser Payer { get; set; } = null!;
    public ApplicationUser? Payee { get; set; }
    public ICollection<PaymentRefund> Refunds { get; set; } = new List<PaymentRefund>();
}
