using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class GetTrendingContentQuery : IRequest<Result<TrendingContentDto>>
{
    public MediaType? MediaType { get; set; } // Filter by Video, Podcast, or both
    public int Days { get; set; } = 7; // Time window for trending calculation
    public int VideoCount { get; set; } = 10;
    public int PodcastCount { get; set; } = 10;
    public string? Category { get; set; }
    public TrendingAlgorithm Algorithm { get; set; } = TrendingAlgorithm.ViewsAndEngagement;
}

public enum TrendingAlgorithm
{
    ViewsOnly,
    ViewsAndEngagement,
    EngagementRate,
    RecentPopularity
}