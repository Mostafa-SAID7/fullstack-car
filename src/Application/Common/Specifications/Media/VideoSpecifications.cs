using Application.Common.Specifications;
using Domain.Entities.Media;
using Domain.Enums.Media;

namespace Application.Common.Specifications.Media;

public class PublicVideosSpecification : BaseSpecification<Video>
{
    public PublicVideosSpecification() 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }
}

public class VideosByCreatorSpecification : BaseSpecification<Video>
{
    public VideosByCreatorSpecification(Guid creatorId) 
        : base(x => x.CreatorId == creatorId)
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }

    public VideosByCreatorSpecification(Guid creatorId, bool includePrivate) 
        : base(x => x.CreatorId == creatorId && (includePrivate || x.IsPublic))
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }
}

public class TrendingVideosSpecification : BaseSpecification<Video>
{
    public TrendingVideosSpecification(int count = 10) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.ViewCount);
        ApplyPaging(0, count);
    }
}

public class RecentPublicVideosSpecification : BaseSpecification<Video>
{
    public RecentPublicVideosSpecification(int count = 10) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
        ApplyPaging(0, count);
    }
}

public class VideosByTagSpecification : BaseSpecification<Video>
{
    public VideosByTagSpecification(string tag) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && x.Tags != null && x.Tags.Contains(tag))
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }

    public new void ApplyPaging(int skip, int take)
    {
        base.ApplyPaging(skip, take);
    }
}

public class VideoSearchSpecification : BaseSpecification<Video>
{
    public VideoSearchSpecification(string searchTerm) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && 
                   (x.Title.Contains(searchTerm) || 
                    x.Description.Contains(searchTerm) || 
                    (x.Tags != null && x.Tags.Contains(searchTerm))))
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }

    public new void ApplyPaging(int skip, int take)
    {
        base.ApplyPaging(skip, take);
    }
}

public class VideosByStatusSpecification : BaseSpecification<Video>
{
    public VideosByStatusSpecification(MediaStatus status) 
        : base(x => x.Status == status)
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }

    public VideosByStatusSpecification(MediaStatus status, Guid creatorId) 
        : base(x => x.Status == status && x.CreatorId == creatorId)
    {
        ApplyOrderByDescending(x => x.CreatedAt);
    }
}

public class VideosByQualitySpecification : BaseSpecification<Video>
{
    public VideosByQualitySpecification(VideoQuality quality) 
        : base(x => x.Quality == quality && x.IsPublic && x.Status == MediaStatus.Published)
    {
        ApplyOrderByDescending(x => x.PublishedAt!);
    }
}

public class PopularVideosSpecification : BaseSpecification<Video>
{
    public PopularVideosSpecification(int minViews = 1000, int count = 10) 
        : base(x => x.IsPublic && x.Status == MediaStatus.Published && x.ViewCount >= minViews)
    {
        ApplyOrderByDescending(x => x.ViewCount);
        ApplyPaging(0, count);
    }
}