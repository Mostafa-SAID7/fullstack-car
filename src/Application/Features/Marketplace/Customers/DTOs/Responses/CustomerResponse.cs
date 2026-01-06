using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Customers.DTOs.Responses;

public class CustomerResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public CustomerStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public CustomerType Type { get; set; }
    public string TypeName { get; set; } = string.Empty;
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
    public string? AssignedSalesRepName { get; set; }
    public decimal LifetimeValue { get; set; }
    public int LoyaltyPoints { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CustomerListResponse
{
    public List<CustomerSummary> Customers { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

public class CustomerSummary
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public CustomerStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public CustomerType Type { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public decimal TotalSpent { get; set; }
    public int OrderCount { get; set; }
    public DateTime? LastOrderDate { get; set; }
    public decimal LifetimeValue { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CustomerStatistics
{
    public int TotalCustomers { get; set; }
    public int ActiveCustomers { get; set; }
    public int InactiveCustomers { get; set; }
    public int SuspendedCustomers { get; set; }
    public int NewCustomersThisMonth { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
    public decimal CustomerLifetimeValue { get; set; }
    public int TotalOrders { get; set; }
    public Dictionary<string, int> CustomersByType { get; set; } = new();
    public Dictionary<string, int> CustomersByStatus { get; set; } = new();
    public Dictionary<string, decimal> RevenueByMonth { get; set; } = new();
}
