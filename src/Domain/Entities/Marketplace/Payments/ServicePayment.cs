using Domain.Entities.Marketplace.Services;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace.Payments;

public class ServicePayment : BaseEntity
{
    public Guid ServiceId { get; set; }
    public string PaymentType { get; set; } = string.Empty; // Upfront, OnCompletion, Split
    public decimal? DepositAmount { get; set; }
    public decimal? DepositPercentage { get; set; }
    public bool RequiresDeposit { get; set; } = false;
    public string? AcceptedPaymentMethods { get; set; } // JSON array
    public bool AcceptsCash { get; set; } = true;
    public bool AcceptsCard { get; set; } = true;
    public bool AcceptsBankTransfer { get; set; } = false;
    public string? PaymentTerms { get; set; }
    public int? PaymentDueDays { get; set; }
    public decimal? LateFeePercentage { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Service Service { get; set; } = null!;
}
