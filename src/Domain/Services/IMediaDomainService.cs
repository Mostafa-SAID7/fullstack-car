using Domain.Entities.Media;

namespace Domain.Services;

public interface IMediaDomainService
{
    Task<bool> CanUserAccessMediaAsync(string userId, string mediaId, CancellationToken cancellationToken = default);
    Task<bool> CanUserModifyMediaAsync(string userId, string mediaId, CancellationToken cancellationToken = default);
    Task<MediaAnalytics> CalculateAnalyticsAsync(string mediaId, CancellationToken cancellationToken = default);
    Task<bool> IsMediaPublishableAsync(string mediaId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Video>> GetTrendingVideosAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetTrendingPodcastsAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Video>> GetRecommendedVideosAsync(string userId, int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetRecommendedPodcastsAsync(string userId, int count = 10, CancellationToken cancellationToken = default);
}