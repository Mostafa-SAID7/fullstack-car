using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

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