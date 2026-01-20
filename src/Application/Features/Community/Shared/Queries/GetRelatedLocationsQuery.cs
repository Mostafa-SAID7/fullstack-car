using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Queries;

public class GetRelatedLocationsQuery : IRequest<Result<PaginatedList<object>>>
{
    public ContentType ContentType { get; set; }
    public Guid ContentId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetRelatedLocationsQueryHandler : IRequestHandler<GetRelatedLocationsQuery, Result<PaginatedList<object>>>
{
    private readonly IApplicationDbContext _context;

    public GetRelatedLocationsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<object>>> Handle(GetRelatedLocationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Locations
            .AsNoTracking()
            .Where(l => l.TargetContentType == request.ContentType && l.TargetId == request.ContentId)
            .OrderBy(l => l.Name);

        var result = await PaginatedList<object>.CreateAsync(
            query.Select(l => (object)new {
                l.Id,
                l.Name,
                l.Description,
                l.Latitude,
                l.Longitude,
                l.Address,
                l.City,
                l.Type,
                l.AverageRating,
                l.ReviewsCount
            }), 
            request.PageNumber, 
            request.PageSize);

        return Result<PaginatedList<object>>.Success(result);
    }
}
