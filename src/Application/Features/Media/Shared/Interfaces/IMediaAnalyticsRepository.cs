using Domain.Entities.Media;
using Domain.Interfaces;

namespace Application.Features.Media.Shared.Interfaces;

public interface IMediaAnalyticsRepository : IRepository<MediaAnalytics>
{
    Task<MediaAnalytics?> GetByMediaIdAsync(Guid mediaId, CancellationToken cancellationToken = default);
    Task<IEnumerable<MediaAnalytics>> GetAnalyticsByCreatorAsync(Guid creatorId, CancellationToken cancellationToken = default);
    Task<IEnumerable<MediaAnalytics>> GetTopPerformingMediaAsync(Domain.Enums.Media.MediaType? mediaType = null, int count = 10, CancellationToken cancellationToken = default);
    Task<bool> UpdateViewCountAsync(Guid mediaId, int viewCount, CancellationToken cancellationToken = default);
    Task<bool> UpdateEngagementMetricsAsync(Guid mediaId, int likes, int dislikes, int comments, int shares, CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetViewsByDateRangeAsync(Guid mediaId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}