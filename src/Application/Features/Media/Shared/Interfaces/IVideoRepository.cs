using Domain.Entities.Media;
using Domain.Interfaces;

namespace Application.Features.Media.Shared.Interfaces;

public interface IVideoRepository : IRepository<Video>
{
    Task<IEnumerable<Video>> GetTrendingVideosAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Video>> GetVideosByCreatorAsync(Guid creatorId, bool includePrivate = false, CancellationToken cancellationToken = default);
    Task<IEnumerable<Video>> SearchVideosAsync(string searchTerm, int skip = 0, int take = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Video>> GetVideosByTagAsync(string tag, int skip = 0, int take = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<Video>> GetPopularVideosAsync(int minViews = 1000, int count = 10, CancellationToken cancellationToken = default);
    Task<int> GetTotalViewCountAsync(Guid creatorId, CancellationToken cancellationToken = default);
    Task<bool> IncrementViewCountAsync(Guid videoId, CancellationToken cancellationToken = default);
    Task<bool> IncrementLikeCountAsync(Guid videoId, CancellationToken cancellationToken = default);
    Task<bool> DecrementLikeCountAsync(Guid videoId, CancellationToken cancellationToken = default);
}