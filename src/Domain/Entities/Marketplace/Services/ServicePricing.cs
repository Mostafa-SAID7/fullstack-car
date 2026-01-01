namespace Domain.Entities.Marketplace.Services;

public class ServicePricing : BaseEntity
{
    public Guid ServiceId { get; set; }
    public string PricingType { get; set; } = string.Empty; // Fixed, Hourly, PerKm, Variable
    public decimal BasePrice { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? PricingTiers { get; set; } // JSON for complex pricing
    public string Currency { get; set; } = "USD";
    public bool IsActive { get; set; } = true;
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public string? Description { get; set; }
    public string? Conditions { get; set; }

    // Navigation properties
    public Service Service { get; set; } = null!;
}