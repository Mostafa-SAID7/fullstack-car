using Application.Common.Specifications.Media;
using Application.Features.Media.Shared.Interfaces;
using Domain.Entities.Media;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Media;

public class PodcastRepository : Repository<Podcast>, IPodcastRepository
{
    public PodcastRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Podcast>> GetTrendingPodcastsAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        var spec = new TrendingPodcastsSpecification(count);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Podcast>> GetPodcastsByCreatorAsync(Guid creatorId, bool includePrivate = false, CancellationToken cancellationToken = default)
    {
        var spec = new PodcastsByCreatorSpecification(creatorId, includePrivate);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Podcast>> SearchPodcastsAsync(string searchTerm, int skip = 0, int take = 10, CancellationToken cancellationToken = default)
    {
        var spec = new PodcastSearchSpecification(searchTerm);
        ((PodcastSearchSpecification)spec).ApplyPaging(skip, take);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Podcast>> GetPodcastsByTagAsync(string tag, int skip = 0, int take = 10, CancellationToken cancellationToken = default)
    {
        var spec = new PodcastsByTagSpecification(tag);
        ((PodcastsByTagSpecification)spec).ApplyPaging(skip, take);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Podcast>> GetPodcastsBySeriesAsync(Guid seriesId, bool includePrivate = false, CancellationToken cancellationToken = default)
    {
        var spec = new PodcastsBySeriesSpecification(seriesId, includePrivate);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Podcast>> GetPopularPodcastsAsync(int minPlays = 100, int count = 10, CancellationToken cancellationToken = default)
    {
        var spec = new PopularPodcastsSpecification(minPlays, count);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<IEnumerable<Podcast>> GetDownloadablePodcastsAsync(int skip = 0, int take = 10, CancellationToken cancellationToken = default)
    {
        var spec = new DownloadablePodcastsSpecification();
        ((DownloadablePodcastsSpecification)spec).ApplyPaging(skip, take);
        return await ListAsync(spec, cancellationToken);
    }

    public async Task<int> GetTotalPlayCountAsync(Guid creatorId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.CreatorId == creatorId)
            .SumAsync(p => p.PlayCount, cancellationToken);
    }

    public async Task<bool> IncrementPlayCountAsync(Guid podcastId, CancellationToken cancellationToken = default)
    {
        try
        {
            var podcast = await GetByIdAsync(podcastId, cancellationToken);
            if (podcast == null) return false;

            podcast.PlayCount++;
            await UpdateAsync(podcast, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IncrementLikeCountAsync(Guid podcastId, CancellationToken cancellationToken = default)
    {
        try
        {
            var podcast = await GetByIdAsync(podcastId, cancellationToken);
            if (podcast == null) return false;

            podcast.LikeCount++;
            await UpdateAsync(podcast, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DecrementLikeCountAsync(Guid podcastId, CancellationToken cancellationToken = default)
    {
        try
        {
            var podcast = await GetByIdAsync(podcastId, cancellationToken);
            if (podcast == null) return false;

            if (podcast.LikeCount > 0)
            {
                podcast.LikeCount--;
                await UpdateAsync(podcast, cancellationToken);
            }
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IncrementDownloadCountAsync(Guid podcastId, CancellationToken cancellationToken = default)
    {
        try
        {
            var podcast = await GetByIdAsync(podcastId, cancellationToken);
            if (podcast == null) return false;

            podcast.DownloadCount++;
            await UpdateAsync(podcast, cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }
}