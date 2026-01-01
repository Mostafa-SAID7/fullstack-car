using Domain.Entities.Identity;

namespace Domain.Entities.Marketplace.Payments;

public class PaymentRefund : BaseEntity
{
    public string RefundId { get; set; } = string.Empty;
    public string? ExternalRefundId { get; set; }
    public Guid PaymentTransactionId { get; set; }
    public decimal RefundAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string RefundReason { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public Guid RequestedByUserId { get; set; }
    public Guid? ProcessedByUserId { get; set; }
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? ProcessorResponse { get; set; }
    public string? Notes { get; set; }
    public bool IsPartialRefund { get; set; } = false;

    // Navigation properties
    public PaymentTransaction PaymentTransaction { get; set; } = null!;
    public ApplicationUser RequestedByUser { get; set; } = null!;
    public ApplicationUser? ProcessedByUser { get; set; }
}