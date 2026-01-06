using Application.Common.Models;
using Application.Features.Admin.Management.Customers.DTOs.Responses;
using Domain.Enums.Admin.Management;
using MediatR;

namespace Application.Features.Admin.Management.Customers.Queries;

public class GetCustomersQuery : IRequest<Result<CustomerListResponse>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public CustomerStatus? Status { get; set; }
    public CustomerType? Type { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public decimal? MinSpent { get; set; }
    public decimal? MaxSpent { get; set; }
    public DateTime? RegisteredAfter { get; set; }
    public DateTime? RegisteredBefore { get; set; }
    public bool? HasOrders { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortDirection { get; set; } = "desc";
}

public class GetCustomerByIdQuery : IRequest<Result<CustomerResponse>>
{
    public Guid CustomerId { get; set; }
}

public class GetCustomerStatisticsQuery : IRequest<Result<CustomerStatistics>>
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class SearchCustomersQuery : IRequest<Result<List<CustomerSummary>>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public int Limit { get; set; } = 20;
    public CustomerType? Type { get; set; }
    public CustomerStatus? Status { get; set; }
}