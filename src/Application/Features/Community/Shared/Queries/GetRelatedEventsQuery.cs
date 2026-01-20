using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Queries;

public class GetRelatedEventsQuery : IRequest<Result<PaginatedList<EventDto>>>
{
    public ContentType ContentType { get; set; }
    public Guid ContentId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool UpcomingOnly { get; set; } = true;
}

public class GetRelatedEventsQueryHandler : IRequestHandler<GetRelatedEventsQuery, Result<PaginatedList<EventDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRelatedEventsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<EventDto>>> Handle(GetRelatedEventsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Events
            .AsNoTracking()
            .Where(e => e.TargetContentType == request.ContentType && e.TargetId == request.ContentId);

        if (request.UpcomingOnly)
        {
            query = query.Where(e => e.StartDate >= DateTime.UtcNow);
        }

        query = query.OrderBy(e => e.StartDate);

        var result = await PaginatedList<EventDto>.CreateAsync(
            query.ProjectTo<EventDto>(_mapper.ConfigurationProvider), 
            request.PageNumber, 
            request.PageSize);

        return Result<PaginatedList<EventDto>>.Success(result);
    }
}
