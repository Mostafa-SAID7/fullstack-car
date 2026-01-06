using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerBehaviorAnalyticsQuery : IRequest<Result<CustomerBehaviorAnalyticsDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public Domain.Enums.Marketplace.CustomerType? CustomerType { get; set; }
}

public class CustomerBehaviorAnalyticsDto
{
    public int TotalCustomers { get; set; }
    public int ActiveCustomers { get; set; }
    public int NewCustomers { get; set; }
    public decimal AverageOrderValue { get; set; }
    public decimal CustomerLifetimeValue { get; set; }
    public int RepeatCustomers { get; set; }
    public double ChurnRate { get; set; }
    public List<BehaviorTrendDto> Trends { get; set; } = new();
}

public class BehaviorTrendDto
{
    public DateTime Date { get; set; }
    public int NewCustomers { get; set; }
    public int ActiveCustomers { get; set; }
    public decimal Revenue { get; set; }
}
