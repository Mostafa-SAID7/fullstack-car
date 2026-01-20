using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Queries;

public class GetRelatedReviewsQuery : IRequest<Result<PaginatedList<ReviewDto>>>
{
    public ContentType ContentType { get; set; }
    public Guid ContentId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetRelatedReviewsQueryHandler : IRequestHandler<GetRelatedReviewsQuery, Result<PaginatedList<ReviewDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRelatedReviewsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<ReviewDto>>> Handle(GetRelatedReviewsQuery request, CancellationToken cancellationToken)
    {
        // Using common Feedback entity for standardized reviews
        var query = _context.Feedbacks
            .AsNoTracking()
            .Where(f => f.ContentType == request.ContentType && f.ContentId == request.ContentId)
            .OrderByDescending(f => f.CreatedAt);

        // We need a mapping from Feedback to ReviewDto or create a new FeedbackDto
        // For now, assuming ReviewDto is compatible or mapping exists
        var result = await PaginatedList<ReviewDto>.CreateAsync(
            query.ProjectTo<ReviewDto>(_mapper.ConfigurationProvider), 
            request.PageNumber, 
            request.PageSize);

        return Result<PaginatedList<ReviewDto>>.Success(result);
    }
}
