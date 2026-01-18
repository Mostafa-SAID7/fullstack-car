using Application.Common.Specifications;
using Application.Common.Specifications.Media;
using Domain.Entities.Media;
using Domain.Interfaces;
using Domain.Services;
using Microsoft.Extensions.Logging;

namespace Application.Features.Media.Shared.Services;

public class MediaDomainService : IMediaDomainService
{
    private readonly IRepository<Video> _videoRepository;
    private readonly IRepository<Podcast> _podcastRepository;
    private readonly IRepository<MediaAnalytics> _analyticsRepository;
    private readonly ILogger<MediaDomainService> _logger;

    public MediaDomainService(
        IRepository<Video> videoRepository,
        IRepository<Podcast> podcastRepository,
        IRepository<MediaAnalytics> analyticsRepository,
        ILogger<MediaDomainService> logger)
    {
        _videoRepository = videoRepository;
        _podcastRepository = podcastRepository;
        _analyticsRepository = analyticsRepository;
        _logger = logger;
    }

    public async Task<bool> CanUserAccessMediaAsync(string userId, string mediaId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if media exists and is public, or if user is the creator
            var video = await _videoRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
            if (video != null)
            {
                return video.IsPublic || video.CreatorId.ToString() == userId;
            }

            var podcast = await _podcastRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
            if (podcast != null)
            {
                return podcast.IsPublic || podcast.CreatorId.ToString() == userId;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user access for media {MediaId} and user {UserId}", mediaId, userId);
            return false;
        }
    }

    public async Task<bool> CanUserModifyMediaAsync(string userId, string mediaId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if user is the creator of the media
            var video = await _videoRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
            if (video != null)
            {
                return video.CreatorId.ToString() == userId;
            }

            var podcast = await _podcastRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
            if (podcast != null)
            {
                return podcast.CreatorId.ToString() == userId;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user modify permission for media {MediaId} and user {UserId}", mediaId, userId);
            return false;
        }
    }

    public async Task<MediaAnalytics> CalculateAnalyticsAsync(string mediaId, CancellationToken cancellationToken = default)
    {
        try
        {
            var analytics = await _analyticsRepository.FirstOrDefaultAsync(
                new MediaAnalyticsSpecification(Guid.Parse(mediaId)).Criteria!, 
                cancellationToken);

            if (analytics == null)
            {
                // Create new analytics record
                analytics = new MediaAnalytics
                {
                    MediaId = Guid.Parse(mediaId),
                    MediaType = await DetermineMediaTypeAsync(mediaId, cancellationToken),
                    LastUpdated = DateTime.UtcNow
                };
                await _analyticsRepository.AddAsync(analytics, cancellationToken);
            }

            return analytics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating analytics for media {MediaId}", mediaId);
            throw;
        }
    }

    public async Task<bool> IsMediaPublishableAsync(string mediaId, CancellationToken cancellationToken = default)
    {
        try
        {
            var video = await _videoRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
            if (video != null)
            {
                return !string.IsNullOrEmpty(video.Title) && 
                       !string.IsNullOrEmpty(video.VideoUrl) && 
                       video.Status != Domain.Enums.Media.MediaStatus.Processing;
            }

            var podcast = await _podcastRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
            if (podcast != null)
            {
                return !string.IsNullOrEmpty(podcast.Title) && 
                       !string.IsNullOrEmpty(podcast.AudioUrl) && 
                       podcast.Status != Domain.Enums.Media.MediaStatus.Processing;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if media {MediaId} is publishable", mediaId);
            return false;
        }
    }

    public async Task<IEnumerable<Video>> GetTrendingVideosAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            var spec = new TrendingVideosSpecification(count);
            return await _videoRepository.ListAsync(spec.Criteria!, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting trending videos");
            return Enumerable.Empty<Video>();
        }
    }

    public async Task<IEnumerable<Podcast>> GetTrendingPodcastsAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            var spec = new TrendingPodcastsSpecification(count);
            return await _podcastRepository.ListAsync(spec.Criteria!, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting trending podcasts");
            return Enumerable.Empty<Podcast>();
        }
    }

    public async Task<IEnumerable<Video>> GetRecommendedVideosAsync(string userId, int count = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            // For now, return recent public videos
            // TODO: Implement recommendation algorithm based on user preferences and viewing history
            var spec = new RecentPublicVideosSpecification(count);
            return await _videoRepository.ListAsync(spec.Criteria!, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recommended videos for user {UserId}", userId);
            return Enumerable.Empty<Video>();
        }
    }

    public async Task<IEnumerable<Podcast>> GetRecommendedPodcastsAsync(string userId, int count = 10, CancellationToken cancellationToken = default)
    {
        try
        {
            // For now, return recent public podcasts
            // TODO: Implement recommendation algorithm based on user preferences and listening history
            var spec = new RecentPublicPodcastsSpecification(count);
            return await _podcastRepository.ListAsync(spec.Criteria!, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recommended podcasts for user {UserId}", userId);
            return Enumerable.Empty<Podcast>();
        }
    }

    private async Task<Domain.Enums.Media.MediaType> DetermineMediaTypeAsync(string mediaId, CancellationToken cancellationToken)
    {
        var video = await _videoRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
        if (video != null)
        {
            return Domain.Enums.Media.MediaType.Video;
        }

        var podcast = await _podcastRepository.GetByIdAsync(Guid.Parse(mediaId), cancellationToken);
        if (podcast != null)
        {
            return Domain.Enums.Media.MediaType.Podcast;
        }

        throw new InvalidOperationException($"Media with ID {mediaId} not found");
    }
}