using Domain.Base;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace.Customers;

public class Customer : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public CustomerStatus Status { get; set; } = CustomerStatus.Active;
    public CustomerType Type { get; set; } = CustomerType.Regular;
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public decimal TotalSpent { get; set; }
    public int OrderCount { get; set; }
    public DateTime? LastOrderDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? PreferredCurrency { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public bool MarketingOptIn { get; set; }
    public string? Notes { get; set; }
    public string? Tags { get; set; }
    public Guid? AssignedSalesRepId { get; set; }
    public decimal LifetimeValue { get; set; }
    public int LoyaltyPoints { get; set; }
}
