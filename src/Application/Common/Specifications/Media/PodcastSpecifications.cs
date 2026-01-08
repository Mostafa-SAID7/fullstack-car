using Application.Common.Specifications;
using Domain.Entities.Media;
using Domain.Enums.Media;

namespace Application.Common.Specifications.Media;

public class PublicPodcastsSpecification : BaseSpecification<Podcast>
{
    public PublicPodcastsSpecification() 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }
}

public class PodcastsByCreatorSpecification : BaseSpecification<Podcast>
{
    public PodcastsByCreatorSpecification(Guid creatorId) 
        : base(x => x.CreatorId == creatorId)
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }

    public PodcastsByCreatorSpecification(Guid creatorId, bool includePrivate) 
        : base(x => x.CreatorId == creatorId && (includePrivate || x.IsPublic))
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }
}

public class TrendingPodcastsSpecification : BaseSpecification<Podcast>
{
    public TrendingPodcastsSpecification(int count = 10) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.PlayCount);
        ApplyPaging(0, count);
    }
}

public class RecentPublicPodcastsSpecification : BaseSpecification<Podcast>
{
    public RecentPublicPodcastsSpecification(int count = 10) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
        ApplyPaging(0, count);
    }
}

public class PodcastsByTagSpecification : BaseSpecification<Podcast>
{
    public PodcastsByTagSpecification(string tag) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && x.Tags != null && x.Tags.Contains(tag))
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }

    public new void ApplyPaging(int skip, int take)
    {
        base.ApplyPaging(skip, take);
    }
}

public class PodcastSearchSpecification : BaseSpecification<Podcast>
{
    public PodcastSearchSpecification(string searchTerm) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && 
                   (x.Title.Contains(searchTerm) || 
                    x.Description.Contains(searchTerm) || 
                    (x.Tags != null && x.Tags.Contains(searchTerm)) ||
                    (x.Transcript != null && x.Transcript.Contains(searchTerm))))
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }

    public new void ApplyPaging(int skip, int take)
    {
        base.ApplyPaging(skip, take);
    }
}

public class PodcastsByStatusSpecification : BaseSpecification<Podcast>
{
    public PodcastsByStatusSpecification(MediaStatus status) 
        : base(x => x.Status == status)
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }

    public PodcastsByStatusSpecification(MediaStatus status, Guid creatorId) 
        : base(x => x.Status == status && x.CreatorId == creatorId)
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }
}

public class PodcastsBySeriesSpecification : BaseSpecification<Podcast>
{
    public PodcastsBySeriesSpecification(Guid seriesId) 
        : base(x => x.SeriesId == seriesId && x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderBy(x => x.SeasonNumber);
        ApplyOrderBy(x => x.EpisodeNumber);
    }

    public PodcastsBySeriesSpecification(Guid seriesId, bool includePrivate) 
        : base(x => x.SeriesId == seriesId && (includePrivate || x.IsPublic))
    {
        ApplyOrderBy(x => x.SeasonNumber);
        ApplyOrderBy(x => x.EpisodeNumber);
    }
}

public class PopularPodcastsSpecification : BaseSpecification<Podcast>
{
    public PopularPodcastsSpecification(int minPlays = 100, int count = 10) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && x.PlayCount >= minPlays)
    {
        ApplyOrderByDescending(x => x.PlayCount);
        ApplyPaging(0, count);
    }
}

public class DownloadablePodcastsSpecification : BaseSpecification<Podcast>
{
    public DownloadablePodcastsSpecification() 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && x.AllowDownload)
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }

    public new void ApplyPaging(int skip, int take)
    {
        base.ApplyPaging(skip, take);
    }
}