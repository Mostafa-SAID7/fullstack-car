using Domain.Entities.Media;
using Domain.Enums.Media;

namespace Application.Features.Media.Analytics.Services;
public interface IMediaAnalyticsService
{
    Task UpdateAnalyticsAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);
    Task IncrementViewCountAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);
    Task UpdateEngagementMetricsAsync(Guid mediaId, MediaType mediaType, string engagementType, int delta = 1, CancellationToken cancellationToken = default);
    Task<MediaAnalytics> GetOrCreateAnalyticsAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);
    Task<bool> ValidateAnalyticsIntegrityAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);
}