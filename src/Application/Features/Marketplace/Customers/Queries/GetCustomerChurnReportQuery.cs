using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerChurnReportQuery : IRequest<Result<CustomerChurnReportDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
    public int InactiveDays { get; set; } = 90;
    public string? GroupBy { get; set; } = "month";
}

public class CustomerChurnReportDto
{
    public double OverallChurnRate { get; set; }
    public int TotalChurnedCustomers { get; set; }
    public int TotalCustomers { get; set; }
    public List<ChurnByPeriodDto> ChurnByPeriod { get; set; } = new();
    public List<ChurnReasonReportDto> ChurnReasons { get; set; } = new();
    public List<ChurnedCustomerDto> RecentlyChurnedCustomers { get; set; } = new();
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
}

public class ChurnByPeriodDto
{
    public DateTime Period { get; set; }
    public double ChurnRate { get; set; }
    public int ChurnedCustomers { get; set; }
    public int TotalCustomers { get; set; }
}

public class ChurnReasonReportDto
{
    public string Reason { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class ChurnedCustomerDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime ChurnDate { get; set; }
    public string? ChurnReason { get; set; }
    public decimal LifetimeValue { get; set; }
    public int OrderCount { get; set; }
}
