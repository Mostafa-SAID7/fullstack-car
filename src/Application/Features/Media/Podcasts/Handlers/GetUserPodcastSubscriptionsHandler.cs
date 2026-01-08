using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class GetUserPodcastSubscriptionsHandler : IRequestHandler<GetUserPodcastSubscriptionsQuery, Result<PaginatedList<PodcastListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUserPodcastSubscriptionsHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<PodcastListDto>>> Handle(GetUserPodcastSubscriptionsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.PodcastSubscriptions
                .Where(s => s.UserId == request.UserId && s.IsActive)
                .Select(s => s.Podcast)
                .Where(p => p.Status == Domain.Enums.Media.MediaStatus.Published);

            var totalCount = await query.CountAsync(cancellationToken);

            var podcasts = await query
                .OrderByDescending(p => p.PublishedAt)
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
            return Result<PaginatedList<PodcastListDto>>.Failure(new[] { $"Error retrieving user subscriptions: {ex.Message}" });
        }
    }
}