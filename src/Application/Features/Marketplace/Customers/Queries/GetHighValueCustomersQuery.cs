using Application.Common.Models;
using MediatR;

namespace Application.Features.Marketplace.Customers.Queries;

public class GetHighValueCustomersQuery : IRequest<Result<PaginatedList<CustomerDto>>>
{
    public decimal MinSpent { get; set; } = 1000;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
