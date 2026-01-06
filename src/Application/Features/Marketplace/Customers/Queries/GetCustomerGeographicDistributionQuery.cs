using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerGeographicDistributionQuery : IRequest<Result<CustomerGeographicDistributionDto>>
{
    public string? Country { get; set; }
    public bool IncludeInactive { get; set; } = false;
    public string? GroupBy { get; set; } = "country"; // country, state, city
}

public class CustomerGeographicDistributionDto
{
    public List<GeographicDataDto> Distribution { get; set; } = new();
    public int TotalCustomers { get; set; }
    public string TopLocation { get; set; } = string.Empty;
}

public class GeographicDataDto
{
    public string Location { get; set; } = string.Empty;
    public int CustomerCount { get; set; }
    public double Percentage { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
}
