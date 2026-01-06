using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Domain.Entities.Media;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class CreatePodcastHandler : IRequestHandler<CreatePodcastCommand, Result<PodcastDto>>
{
    private readonly IApplicationDbContext _context;

    public CreatePodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastDto>> Handle(CreatePodcastCommand request, CancellationToken cancellationToken)
    {
        // Validate series if provided
        if (request.Request.SeriesId.HasValue)
        {
            var series = await _context.PodcastSeries
                .FirstOrDefaultAsync(s => s.Id == request.Request.SeriesId.Value && s.CreatorId == request.CreatorId, cancellationToken);

            if (series == null)
            {
                return Result<PodcastDto>.Failure("Podcast series not found or access denied");
            }
        }

        var podcast = new Podcast
        {
            Title = request.Request.Title,
            Description = request.Request.Description,
            CoverImage = request.Request.CoverImage,
            Tags = request.Request.Tags,
            IsPublic = request.Request.IsPublic,
            AllowComments = request.Request.AllowComments,
            AllowDownload = request.Request.AllowDownload,
            Transcript = request.Request.Transcript,
            EpisodeNumber = request.Request.EpisodeNumber,
            SeasonNumber = request.Request.SeasonNumber,
            SeriesId = request.Request.SeriesId,
            CreatorId = request.CreatorId,
            Status = MediaStatus.Draft,
            AudioUrl = string.Empty, // Will be set after upload
            Duration = TimeSpan.Zero, // Will be set after processing
            FileSize = 0 // Will be set after upload
        };

        _context.Podcasts.Add(podcast);
        await _context.SaveChangesAsync(cancellationToken);

        var podcastDto = new PodcastDto
        {
            Id = podcast.Id,
            Title = podcast.Title,
            Description = podcast.Description,
            CoverImage = podcast.CoverImage,
            AudioUrl = podcast.AudioUrl,
            Duration = podcast.Duration,
            Status = podcast.Status,
            FileSize = podcast.FileSize,
            Tags = podcast.Tags,
            PlayCount = podcast.PlayCount,
            LikeCount = podcast.LikeCount,
            DownloadCount = podcast.DownloadCount,
            IsPublic = podcast.IsPublic,
            AllowComments = podcast.AllowComments,
            AllowDownload = podcast.AllowDownload,
            PublishedAt = podcast.PublishedAt,
            Transcript = podcast.Transcript,
            EpisodeNumber = podcast.EpisodeNumber,
            SeasonNumber = podcast.SeasonNumber,
            SeriesId = podcast.SeriesId,
            CreatorId = podcast.CreatorId,
            CreatedAt = podcast.CreatedAt,
            UpdatedAt = podcast.UpdatedAt
        };

        return Result<PodcastDto>.Success(podcastDto);
    }
}

public class UpdatePodcastHandler : IRequestHandler<UpdatePodcastCommand, Result<PodcastDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdatePodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastDto>> Handle(UpdatePodcastCommand request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.CreatorId == request.UserId, cancellationToken);

        if (podcast == null)
        {
            return Result<PodcastDto>.Failure("Podcast not found or access denied");
        }

        podcast.Title = request.Request.Title;
        podcast.Description = request.Request.Description;
        podcast.CoverImage = request.Request.CoverImage;
        podcast.Tags = request.Request.Tags;
        podcast.IsPublic = request.Request.IsPublic;
        podcast.AllowComments = request.Request.AllowComments;
        podcast.AllowDownload = request.Request.AllowDownload;
        podcast.Transcript = request.Request.Transcript;
        podcast.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var podcastDto = new PodcastDto
        {
            Id = podcast.Id,
            Title = podcast.Title,
            Description = podcast.Description,
            CoverImage = podcast.CoverImage,
            AudioUrl = podcast.AudioUrl,
            Duration = podcast.Duration,
            Status = podcast.Status,
            FileSize = podcast.FileSize,
            Tags = podcast.Tags,
            PlayCount = podcast.PlayCount,
            LikeCount = podcast.LikeCount,
            DownloadCount = podcast.DownloadCount,
            IsPublic = podcast.IsPublic,
            AllowComments = podcast.AllowComments,
            AllowDownload = podcast.AllowDownload,
            PublishedAt = podcast.PublishedAt,
            Transcript = podcast.Transcript,
            EpisodeNumber = podcast.EpisodeNumber,
            SeasonNumber = podcast.SeasonNumber,
            SeriesId = podcast.SeriesId,
            CreatorId = podcast.CreatorId,
            CreatedAt = podcast.CreatedAt,
            UpdatedAt = podcast.UpdatedAt
        };

        return Result<PodcastDto>.Success(podcastDto);
    }
}

public class DeletePodcastHandler : IRequestHandler<DeletePodcastCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeletePodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeletePodcastCommand request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.CreatorId == request.UserId, cancellationToken);

        if (podcast == null)
        {
            return Result<bool>.Failure("Podcast not found or access denied");
        }

        podcast.IsDeleted = true;
        podcast.DeletedAt = DateTime.UtcNow;
        podcast.DeletedBy = request.UserId.ToString();

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

public class PublishPodcastHandler : IRequestHandler<PublishPodcastCommand, Result<PodcastDto>>
{
    private readonly IApplicationDbContext _context;

    public PublishPodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastDto>> Handle(PublishPodcastCommand request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.CreatorId == request.UserId, cancellationToken);

        if (podcast == null)
        {
            return Result<PodcastDto>.Failure("Podcast not found or access denied");
        }

        if (string.IsNullOrEmpty(podcast.AudioUrl))
        {
            return Result<PodcastDto>.Failure("Audio file must be uploaded before publishing");
        }

        podcast.Status = MediaStatus.Published;
        podcast.PublishedAt = DateTime.UtcNow;
        podcast.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var podcastDto = new PodcastDto
        {
            Id = podcast.Id,
            Title = podcast.Title,
            Description = podcast.Description,
            CoverImage = podcast.CoverImage,
            AudioUrl = podcast.AudioUrl,
            Duration = podcast.Duration,
            Status = podcast.Status,
            FileSize = podcast.FileSize,
            Tags = podcast.Tags,
            PlayCount = podcast.PlayCount,
            LikeCount = podcast.LikeCount,
            DownloadCount = podcast.DownloadCount,
            IsPublic = podcast.IsPublic,
            AllowComments = podcast.AllowComments,
            AllowDownload = podcast.AllowDownload,
            PublishedAt = podcast.PublishedAt,
            Transcript = podcast.Transcript,
            EpisodeNumber = podcast.EpisodeNumber,
            SeasonNumber = podcast.SeasonNumber,
            SeriesId = podcast.SeriesId,
            CreatorId = podcast.CreatorId,
            CreatedAt = podcast.CreatedAt,
            UpdatedAt = podcast.UpdatedAt
        };

        return Result<PodcastDto>.Success(podcastDto);
    }
}
