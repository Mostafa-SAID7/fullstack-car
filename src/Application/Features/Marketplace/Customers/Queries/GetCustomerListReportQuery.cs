using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerListReportQuery : IRequest<Result<CustomerListReportDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? Format { get; set; } = "json";
    public string Status { get; set; } = string.Empty;
    public Domain.Enums.Marketplace.CustomerType? Type { get; set; }
    public string? Segment { get; set; }
}

public class CustomerListReportDto
{
    public List<CustomerReportDto> Customers { get; set; } = new();
    public int TotalCount { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string? ExportUrl { get; set; }
    public object? JsonData { get; set; }
    public byte[]? CsvData { get; set; }
    public byte[]? ExcelData { get; set; }
}

public class CustomerReportDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
    public int OrderCount { get; set; }
    public string? Location { get; set; }
    public List<string> Segments { get; set; } = new();
}
