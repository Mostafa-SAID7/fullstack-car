using Domain.Entities.Media;
using Domain.Interfaces;

namespace Application.Features.Media.Shared.Interfaces;

public interface IPodcastRepository : IRepository<Podcast>
{
    Task<IEnumerable<Podcast>> GetTrendingPodcastsAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetPodcastsByCreatorAsync(Guid creatorId, bool includePrivate = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> SearchPodcastsAsync(string searchTerm, int skip = 0, int take = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetPodcastsByTagAsync(string tag, int skip = 0, int take = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetPodcastsBySeriesAsync(Guid seriesId, bool includePrivate = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetPopularPodcastsAsync(int minPlays = 100, int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Podcast>> GetDownloadablePodcastsAsync(int skip = 0, int take = 10, CancellationToken cancellationToken = default);
    Task<int> GetTotalPlayCountAsync(Guid creatorId, CancellationToken cancellationToken = default);
    Task<bool> IncrementPlayCountAsync(Guid podcastId, CancellationToken cancellationToken = default);
    Task<bool> IncrementLikeCountAsync(Guid podcastId, CancellationToken cancellationToken = default);
    Task<bool> DecrementLikeCountAsync(Guid podcastId, CancellationToken cancellationToken = default);
    Task<bool> IncrementDownloadCountAsync(Guid podcastId, CancellationToken cancellationToken = default);
}