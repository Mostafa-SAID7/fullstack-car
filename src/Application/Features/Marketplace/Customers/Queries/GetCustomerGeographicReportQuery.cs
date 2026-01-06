using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerGeographicReportQuery : IRequest<Result<CustomerGeographicReportDto>>
{
    public string? Format { get; set; } = "json";
    public bool IncludeInactive { get; set; } = false;
    public string? GroupBy { get; set; } = "country";
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CustomerGeographicReportDto
{
    public List<GeographicReportDataDto> GeographicData { get; set; } = new();
    public int TotalCustomers { get; set; }
    public string TopLocation { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
}

public class GeographicReportDataDto
{
    public string Location { get; set; } = string.Empty;
    public int CustomerCount { get; set; }
    public double CustomerPercentage { get; set; }
    public decimal Revenue { get; set; }
    public double RevenuePercentage { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int OrderCount { get; set; }
}
