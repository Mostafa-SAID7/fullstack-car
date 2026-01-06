using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerLoyaltyReportQuery : IRequest<Result<CustomerLoyaltyReportDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
    public int MinPoints { get; set; } = 0;
}

public class CustomerLoyaltyReportDto
{
    public int TotalLoyalCustomers { get; set; }
    public double LoyaltyRate { get; set; }
    public decimal AverageLoyaltyPoints { get; set; }
    public List<LoyaltyTierDto> LoyaltyTiers { get; set; } = new();
    public List<LoyalCustomerDto> TopLoyalCustomers { get; set; } = new();
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
}

public class LoyaltyTierDto
{
    public string TierName { get; set; } = string.Empty;
    public int CustomerCount { get; set; }
    public double Percentage { get; set; }
    public decimal MinPoints { get; set; }
    public decimal MaxPoints { get; set; }
}

public class LoyalCustomerDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal LoyaltyPoints { get; set; }
    public string TierName { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
    public int OrderCount { get; set; }
}
