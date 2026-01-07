using System.ComponentModel.DataAnnotations;

namespace Application.Features.Marketplace.Integration.DTOs.Requests;

public class CreateMarketplacePromotionRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    public string Type { get; set; } = string.Empty; // Percentage, FixedAmount, etc.
    
    [Required]
    public decimal Value { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    public string? ApplicableProducts { get; set; } // JSON array of product IDs
    public string? ApplicableServices { get; set; } // JSON array of service IDs
    public string? ApplicableCustomers { get; set; } // JSON array of customer IDs
    
    public decimal? MinimumOrderValue { get; set; }
    public int? MaxUsageCount { get; set; }
    public int? MaxUsagePerCustomer { get; set; }
    
    public bool IsActive { get; set; } = true;
}