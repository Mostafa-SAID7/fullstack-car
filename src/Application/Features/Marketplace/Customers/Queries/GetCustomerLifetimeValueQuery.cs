using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerLifetimeValueQuery : IRequest<Result<CustomerLifetimeValueDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int TopCount { get; set; } = 10;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class CustomerLifetimeValueDto
{
    public decimal AverageLifetimeValue { get; set; }
    public decimal MedianLifetimeValue { get; set; }
    public decimal TotalLifetimeValue { get; set; }
    public List<CustomerValueDto> TopCustomers { get; set; } = new();
}

public class CustomerValueDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal LifetimeValue { get; set; }
    public int OrderCount { get; set; }
    public DateTime FirstOrderDate { get; set; }
    public DateTime? LastOrderDate { get; set; }
}
