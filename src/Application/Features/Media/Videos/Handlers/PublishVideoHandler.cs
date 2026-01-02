using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class PublishVideoHandler : IRequestHandler<PublishVideoCommand, Result<VideoDto>>
{
    private readonly IApplicationDbContext _context;

    public PublishVideoHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoDto>> Handle(PublishVideoCommand request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == request.Id && v.CreatorId == request.UserId, cancellationToken);

        if (video == null)
        {
            return Result<VideoDto>.Failure("Video not found or access denied");
        }

        if (string.IsNullOrEmpty(video.VideoUrl))
        {
            return Result<VideoDto>.Failure("Video file must be uploaded before publishing");
        }

        video.Status = Domain.Enums.Media.MediaStatus.Published;
        video.PublishedAt = DateTime.UtcNow;
        video.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var videoDto = new VideoDto
        {
            Id = video.Id,
            Title = video.Title,
            Description = video.Description,
            Thumbnail = video.Thumbnail,
            VideoUrl = video.VideoUrl,
            PreviewUrl = video.PreviewUrl,
            Duration = video.Duration,
            Quality = video.Quality,
            Status = video.Status,
            FileSize = video.FileSize,
            Tags = video.Tags,
            ViewCount = video.ViewCount,
            LikeCount = video.LikeCount,
            DislikeCount = video.DislikeCount,
            IsPublic = video.IsPublic,
            AllowComments = video.AllowComments,
            PublishedAt = video.PublishedAt,
            CreatorId = video.CreatorId,
            CreatedAt = video.CreatedAt,
            UpdatedAt = video.UpdatedAt
        };

        return Result<VideoDto>.Success(videoDto);
    }
}