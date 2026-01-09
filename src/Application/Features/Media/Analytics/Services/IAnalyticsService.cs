using Domain.Entities.Media;
using Domain.Enums.Media;

namespace Application.Features.Media.Analytics.Services;

/// <summary>
/// Service interface for real-time media analytics operations
/// </summary>
public interface IMediaAnalyticsService
{
    /// <summary>
    /// Updates analytics data immediately after a view/play event
    /// </summary>
    Task UpdateAnalyticsAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Increments view count for a media item
    /// </summary>
    Task IncrementViewCountAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates engagement metrics (likes, comments, shares)
    /// </summary>
    Task UpdateEngagementMetricsAsync(Guid mediaId, MediaType mediaType, string engagementType, int delta = 1, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets or creates analytics record for a media item
    /// </summary>
    Task<MediaAnalytics> GetOrCreateAnalyticsAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates analytics data integrity
    /// </summary>
    Task<bool> ValidateAnalyticsIntegrityAsync(Guid mediaId, MediaType mediaType, CancellationToken cancellationToken = default);
}