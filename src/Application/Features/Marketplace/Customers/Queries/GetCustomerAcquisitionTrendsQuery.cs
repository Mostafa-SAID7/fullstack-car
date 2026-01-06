using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerAcquisitionTrendsQuery : IRequest<Result<CustomerAcquisitionTrendsDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string? GroupBy { get; set; } = "day"; // day, week, month
}

public class CustomerAcquisitionTrendsDto
{
    public int TotalNewCustomers { get; set; }
    public double GrowthRate { get; set; }
    public List<AcquisitionTrendDto> Trends { get; set; } = new();
    public List<AcquisitionChannelDto> Channels { get; set; } = new();
}

public class AcquisitionTrendDto
{
    public DateTime Date { get; set; }
    public int NewCustomers { get; set; }
    public double GrowthRate { get; set; }
}

public class AcquisitionChannelDto
{
    public string Channel { get; set; } = string.Empty;
    public int CustomerCount { get; set; }
    public double Percentage { get; set; }
    public decimal AverageCost { get; set; }
}
