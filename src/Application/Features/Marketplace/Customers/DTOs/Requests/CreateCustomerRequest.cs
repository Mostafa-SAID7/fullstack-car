using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Customers.DTOs.Requests;

public class CreateCustomerRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public CustomerType Type { get; set; } = CustomerType.Regular;
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? PreferredCurrency { get; set; }
    public bool MarketingOptIn { get; set; }
    public string? Notes { get; set; }
    public string? Tags { get; set; }
    public Guid? AssignedSalesRepId { get; set; }
}

public class UpdateCustomerRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public CustomerStatus Status { get; set; }
    public CustomerType Type { get; set; }
    public string? Company { get; set; }
    public string? JobTitle { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? PreferredCurrency { get; set; }
    public bool MarketingOptIn { get; set; }
    public string? Notes { get; set; }
    public string? Tags { get; set; }
    public Guid? AssignedSalesRepId { get; set; }
}

public class AddLoyaltyPointsRequest
{
    public int Points { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
}

public class DeductLoyaltyPointsRequest
{
    public int Points { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class BulkUpdateCustomersRequest
{
    public List<Guid> CustomerIds { get; set; } = new();
    public CustomerStatus? Status { get; set; }
    public CustomerType? Type { get; set; }
    public string? Tags { get; set; }
    public Guid? AssignedSalesRepId { get; set; }
}

public class BulkUpdateLoyaltyPointsRequest
{
    public List<Guid> CustomerIds { get; set; } = new();
    public int Points { get; set; }
    public string Reason { get; set; } = string.Empty;
    public bool IsAddition { get; set; } = true;
}

public class CreateCustomerSegmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> Criteria { get; set; } = new();
}

public class UpdateCustomerSegmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> Criteria { get; set; } = new();
}
