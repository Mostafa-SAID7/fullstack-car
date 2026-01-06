using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetCustomerSegmentsQuery : IRequest<Result<List<CustomerSegmentDto>>>
{
}

public class CustomerSegmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Criteria { get; set; } = string.Empty;
    public int CustomerCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
