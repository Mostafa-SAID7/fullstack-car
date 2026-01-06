using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerRevenueAnalysisReportQuery : IRequest<Result<CustomerRevenueAnalysisReportDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
    public string? GroupBy { get; set; } = "month";
}

public class CustomerRevenueAnalysisReportDto
{
    public decimal TotalRevenue { get; set; }
    public decimal AverageRevenuePerCustomer { get; set; }
    public int TotalCustomers { get; set; }
    public List<RevenueByPeriodDto> RevenueByPeriod { get; set; } = new();
    public List<TopRevenueCustomerDto> TopCustomers { get; set; } = new();
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
}

public class RevenueByPeriodDto
{
    public DateTime Period { get; set; }
    public decimal Revenue { get; set; }
    public int CustomerCount { get; set; }
    public decimal AveragePerCustomer { get; set; }
}

public class TopRevenueCustomerDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}
