using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetAtRiskCustomersQuery : IRequest<Result<PaginatedList<CustomerDto>>>
{
    public int InactiveDays { get; set; } = 90;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
