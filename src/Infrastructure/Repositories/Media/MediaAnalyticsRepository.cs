using Application.Common.Specifications.Media;
using Application.Features.Media.Shared.Interfaces;
using Domain.Entities.Media;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Media;

public class MediaAnalyticsRepository : Repository<MediaAnalytics>, IMediaAnalyticsRepository
{
    public MediaAnalyticsRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<MediaAnalytics?> GetByMediaIdAsync(Guid mediaId, CancellationToken cancellationToken = default)
    {
        var spec = new MediaAnalyticsSpecification(mediaId);
        return await FirstOrDefaultAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<MediaAnalytics>> GetAnalyticsByCreatorAsync(Guid creatorId, CancellationToken cancellationToken = default)
    {
        // This would require joining with Video/Podcast tables to filter by creator
        // For now, return empty collection - this would need to be implemented based on specific requirements
        return await Task.FromResult(Enumerable.Empty<MediaAnalytics>());
    }

    public async Task<IEnumerable<MediaAnalytics>> GetTopPerformingMediaAsync(Domain.Enums.Media.MediaType? mediaType = null, int count = 10, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        if (mediaType.HasValue)
        {
            query = query.Where(a => a.MediaType == mediaType.Value);
        }

        return await query
            .OrderByDescending(a => a.ViewsTotal)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> UpdateViewCountAsync(Guid mediaId, int viewCount, CancellationToken cancellationToken = default)
    {
        try
        {
            var analytics = await GetByMediaIdAsync(mediaId, cancellationToken);
            if (analytics == null) return false;

            analytics.ViewsTotal = viewCount;
            analytics.LastUpdated = DateTime.UtcNow;
            await UpdateAsync(analytics, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UpdateEngagementMetricsAsync(Guid mediaId, int likes, int dislikes, int comments, int shares, CancellationToken cancellationToken = default)
    {
        try
        {
            var analytics = await GetByMediaIdAsync(mediaId, cancellationToken);
            if (analytics == null) return false;

            analytics.LikesCount = likes;
            analytics.DislikesCount = dislikes;
            analytics.CommentsCount = comments;
            analytics.SharesCount = shares;
            analytics.LastUpdated = DateTime.UtcNow;
            await UpdateAsync(analytics, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<Dictionary<string, int>> GetViewsByDateRangeAsync(Guid mediaId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        // This would require a more complex implementation with time-series data
        // For now, return basic data from the analytics record
        var analytics = await GetByMediaIdAsync(mediaId, cancellationToken);
        if (analytics == null)
        {
            return new Dictionary<string, int>();
        }

        return new Dictionary<string, int>
        {
            { "today", analytics.ViewsToday },
            { "week", analytics.ViewsWeek },
            { "month", analytics.ViewsMonth },
            { "total", analytics.ViewsTotal }
        };
    }
}