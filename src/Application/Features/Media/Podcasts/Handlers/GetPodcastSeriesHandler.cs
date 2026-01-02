using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class GetPodcastSeriesHandler : IRequestHandler<GetPodcastSeriesQuery, Result<PaginatedList<PodcastSeriesDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPodcastSeriesHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<PodcastSeriesDto>>> Handle(GetPodcastSeriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.PodcastSeries.AsQueryable();

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(s => s.Name.Contains(request.SearchTerm) || 
                                        s.Description.Contains(request.SearchTerm));
            }

            if (request.CreatorId.HasValue)
            {
                query = query.Where(s => s.CreatorId == request.CreatorId.Value);
            }

            if (!string.IsNullOrEmpty(request.Category))
            {
                query = query.Where(s => s.Category == request.Category);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var series = await query
                .OrderByDescending(s => s.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var seriesDtos = _mapper.Map<List<PodcastSeriesDto>>(series);

            var paginatedResult = new PaginatedList<PodcastSeriesDto>(
                seriesDtos, 
                totalCount, 
                request.PageNumber, 
                request.PageSize);

            return Result<PaginatedList<PodcastSeriesDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<PodcastSeriesDto>>.Failure(new[] { $"Error retrieving podcast series: {ex.Message}" });
        }
    }
}