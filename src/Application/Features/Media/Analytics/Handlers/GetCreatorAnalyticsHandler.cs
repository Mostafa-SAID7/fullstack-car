using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class GetCreatorAnalyticsHandler : IRequestHandler<GetCreatorAnalyticsQuery, Result<CreatorAnalyticsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCreatorAnalyticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CreatorAnalyticsDto>> Handle(GetCreatorAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (fromDate, toDate) = GetDateRange(request.TimeRange, request.FromDate, request.ToDate);

            var analytics = new CreatorAnalyticsDto
            {
                CreatorId = request.CreatorId,
                CreatorName = "Creator", // Would need to join with Users table
                TimeRange = request.TimeRange
            };

            // Get creator metrics
            var videos = await _context.Videos
                .Where(v => v.CreatorId == request.CreatorId && !v.IsDeleted)
                .ToListAsync(cancellationToken);

            var podcasts = await _context.Podcasts
                .Where(p => p.CreatorId == request.CreatorId && !p.IsDeleted)
                .ToListAsync(cancellationToken);

            analytics.Metrics = new CreatorMetricsDto
            {
                TotalViews = videos.Sum(v => v.ViewCount),
                TotalPlays = podcasts.Sum(p => p.PlayCount),
                TotalLikes = videos.Sum(v => v.LikeCount) + podcasts.Sum(p => p.LikeCount),
                TotalVideos = videos.Count,
                TotalPodcasts = podcasts.Count,
                AverageEngagementRate = CalculateAverageEngagementRate(videos, podcasts)
            };

            // Get top content if requested
            if (request.IncludeTopContent)
            {
                analytics.TopVideos = videos
                    .OrderByDescending(v => v.ViewCount)
                    .Take(request.TopContentLimit)
                    .Select(v => new TopContentDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        Thumbnail = v.Thumbnail,
                        Views = v.ViewCount,
                        Likes = v.LikeCount,
                        EngagementRate = v.ViewCount > 0 ? (double)v.LikeCount / v.ViewCount * 100 : 0,
                        PublishedAt = v.PublishedAt ?? v.CreatedAt
                    })
                    .ToList();

                analytics.TopPodcasts = podcasts
                    .OrderByDescending(p => p.PlayCount)
                    .Take(request.TopContentLimit)
                    .Select(p => new TopContentDto
                    {
                        Id = p.Id,
                        Title = p.Title,
                        Thumbnail = p.CoverImage,
                        Views = p.PlayCount,
                        Likes = p.LikeCount,
                        EngagementRate = p.PlayCount > 0 ? (double)p.LikeCount / p.PlayCount * 100 : 0,
                        PublishedAt = p.PublishedAt ?? p.CreatedAt
                    })
                    .ToList();
            }

            return Result<CreatorAnalyticsDto>.Success(analytics);
        }
        catch (Exception ex)
        {
            return Result<CreatorAnalyticsDto>.Failure(new[] { $"Error retrieving creator analytics: {ex.Message}" });
        }
    }

    private double CalculateAverageEngagementRate(List<Domain.Entities.Media.Video> videos, List<Domain.Entities.Media.Podcast> podcasts)
    {
        var totalViews = videos.Sum(v => v.ViewCount) + podcasts.Sum(p => p.PlayCount);
        var totalLikes = videos.Sum(v => v.LikeCount) + podcasts.Sum(p => p.LikeCount);
        
        return totalViews > 0 ? (double)totalLikes / totalViews * 100 : 0;
    }

    private (DateTime fromDate, DateTime toDate) GetDateRange(string timeRange, DateTime? fromDate, DateTime? toDate)
    {
        if (fromDate.HasValue && toDate.HasValue)
        {
            return (fromDate.Value, toDate.Value);
        }

        var now = DateTime.UtcNow;
        return timeRange.ToLower() switch
        {
            "1d" => (now.AddDays(-1), now),
            "7d" => (now.AddDays(-7), now),
            "30d" => (now.AddDays(-30), now),
            "90d" => (now.AddDays(-90), now),
            "1y" => (now.AddYears(-1), now),
            _ => (now.AddDays(-30), now)
        };
    }
}