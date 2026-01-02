using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class GetMyPodcastsHandler : IRequestHandler<GetMyPodcastsQuery, Result<PaginatedList<PodcastListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMyPodcastsHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<PodcastListDto>>> Handle(GetMyPodcastsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Podcasts
                .Where(p => p.CreatorId == request.UserId)
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(p => p.Status == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);
            
            var podcasts = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var podcastDtos = _mapper.Map<List<PodcastListDto>>(podcasts);
            
            var paginatedResult = new PaginatedList<PodcastListDto>(
                podcastDtos, 
                totalCount, 
                request.PageNumber, 
                request.PageSize);

            return Result<PaginatedList<PodcastListDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<PodcastListDto>>.Failure(new[] { $"Error retrieving user podcasts: {ex.Message}" });
        }
    }
}