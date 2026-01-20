using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Queries;

public class GetRelatedGroupsQuery : IRequest<Result<PaginatedList<GroupDto>>>
{
    public ContentType ContentType { get; set; }
    public Guid ContentId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetRelatedGroupsQueryHandler : IRequestHandler<GetRelatedGroupsQuery, Result<PaginatedList<GroupDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRelatedGroupsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<GroupDto>>> Handle(GetRelatedGroupsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Groups
            .AsNoTracking()
            .Where(g => g.TargetContentType == request.ContentType && g.TargetId == request.ContentId)
            .OrderBy(g => g.Name);

        var result = await PaginatedList<GroupDto>.CreateAsync(
            query.ProjectTo<GroupDto>(_mapper.ConfigurationProvider), 
            request.PageNumber, 
            request.PageSize);

        return Result<PaginatedList<GroupDto>>.Success(result);
    }
}
