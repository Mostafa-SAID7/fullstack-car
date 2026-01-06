using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class GetTrendingPodcastsHandler : IRequestHandler<GetTrendingPodcastsQuery, Result<List<PodcastListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTrendingPodcastsHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<List<PodcastListDto>>> Handle(GetTrendingPodcastsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-request.Days);

            var trendingPodcasts = await _context.Podcasts
                .Where(p => p.Status == Domain.Enums.Media.MediaStatus.Published && 
                           p.IsPublic && 
                           p.CreatedAt >= cutoffDate)
                .GroupJoin(_context.PodcastPlays.Where(pp => pp.CreatedAt >= cutoffDate),
                    p => p.Id,
                    pp => pp.PodcastId,
                    (podcast, plays) => new { Podcast = podcast, PlayCount = plays.Count() })
                .GroupJoin(_context.PodcastLikes,
                    p => p.Podcast.Id,
                    pl => pl.PodcastId,
                    (p, likes) => new { p.Podcast, p.PlayCount, LikeCount = likes.Count() })
                .OrderByDescending(x => x.PlayCount + (x.LikeCount * 2)) // Weight likes more than plays
                .Take(request.Count)
                .Select(x => x.Podcast)
                .ToListAsync(cancellationToken);

            var podcastDtos = _mapper.Map<List<PodcastListDto>>(trendingPodcasts);

            return Result<List<PodcastListDto>>.Success(podcastDtos);
        }
        catch (Exception ex)
        {
            return Result<List<PodcastListDto>>.Failure(new[] { $"Error retrieving trending podcasts: {ex.Message}" });
        }
    }
}
