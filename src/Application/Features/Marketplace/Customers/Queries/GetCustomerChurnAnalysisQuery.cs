using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerChurnAnalysisQuery : IRequest<Result<CustomerChurnAnalysisDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int InactiveDays { get; set; } = 90;
}

public class CustomerChurnAnalysisDto
{
    public double ChurnRate { get; set; }
    public int ChurnedCustomers { get; set; }
    public int RetainedCustomers { get; set; }
    public int TotalCustomers { get; set; }
    public List<ChurnReasonDto> ChurnReasons { get; set; } = new();
    public List<ChurnTrendDto> ChurnTrends { get; set; } = new();
}

public class ChurnReasonDto
{
    public string Reason { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class ChurnTrendDto
{
    public DateTime Date { get; set; }
    public double ChurnRate { get; set; }
    public int ChurnedCustomers { get; set; }
}
