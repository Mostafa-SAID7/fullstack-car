using Application.Common.Specifications.Media;
using Application.Features.Media.Shared.Interfaces;
using Domain.Entities.Media;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Media;

public class VideoRepository : Repository<Video>, IVideoRepository
{
    public VideoRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Video>> GetTrendingVideosAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        var spec = new TrendingVideosSpecification(count);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Video>> GetVideosByCreatorAsync(Guid creatorId, bool includePrivate = false, CancellationToken cancellationToken = default)
    {
        var spec = new VideosByCreatorSpecification(creatorId, includePrivate);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Video>> SearchVideosAsync(string searchTerm, int skip = 0, int take = 10, CancellationToken cancellationToken = default)
    {
        var spec = new VideoSearchSpecification(searchTerm);
        ((VideoSearchSpecification)spec).ApplyPaging(skip, take);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Video>> GetVideosByTagAsync(string tag, int skip = 0, int take = 10, CancellationToken cancellationToken = default)
    {
        var spec = new VideosByTagSpecification(tag);
        ((VideosByTagSpecification)spec).ApplyPaging(skip, take);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Video>> GetPopularVideosAsync(int minViews = 1000, int count = 10, CancellationToken cancellationToken = default)
    {
        var spec = new PopularVideosSpecification(minViews, count);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<int> GetTotalViewCountAsync(Guid creatorId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.CreatorId == creatorId)
            .SumAsync(v => v.ViewCount, cancellationToken);
    }

    public async Task<bool> IncrementViewCountAsync(Guid videoId, CancellationToken cancellationToken = default)
    {
        try
        {
            var video = await GetByIdAsync(videoId, cancellationToken);
            if (video == null) return false;

            video.ViewCount++;
            await UpdateAsync(video, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IncrementLikeCountAsync(Guid videoId, CancellationToken cancellationToken = default)
    {
        try
        {
            var video = await GetByIdAsync(videoId, cancellationToken);
            if (video == null) return false;

            video.LikeCount++;
            await UpdateAsync(video, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DecrementLikeCountAsync(Guid videoId, CancellationToken cancellationToken = default)
    {
        try
        {
            var video = await GetByIdAsync(videoId, cancellationToken);
            if (video == null) return false;

            if (video.LikeCount > 0)
            {
                video.LikeCount--;
                await UpdateAsync(video, cancellationToken);
            }
            return true;
        }
        catch
        {
            return false;
        }
    }
}