using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Responses;
using Domain.Entities.Media;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class CreateVideoHandler : IRequestHandler<CreateVideoCommand, Result<VideoDto>>
{
    private readonly IApplicationDbContext _context;

    public CreateVideoHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoDto>> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
    {
        var video = new Video
        {
            Title = request.Request.Title,
            Description = request.Request.Description,
            Thumbnail = request.Request.Thumbnail,
            Quality = request.Request.Quality,
            Tags = request.Request.Tags,
            IsPublic = request.Request.IsPublic,
            AllowComments = request.Request.AllowComments,
            CreatorId = request.CreatorId,
            Status = MediaStatus.Draft,
            VideoUrl = string.Empty, // Will be set after upload
            Duration = TimeSpan.Zero, // Will be set after processing
            FileSize = 0 // Will be set after upload
        };

        _context.Videos.Add(video);
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

public class UpdateVideoHandler : IRequestHandler<UpdateVideoCommand, Result<VideoDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateVideoHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoDto>> Handle(UpdateVideoCommand request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == request.Id && v.CreatorId == request.UserId, cancellationToken);

        if (video == null)
        {
            return Result<VideoDto>.Failure("Video not found or access denied");
        }

        video.Title = request.Request.Title;
        video.Description = request.Request.Description;
        video.Thumbnail = request.Request.Thumbnail;
        video.Tags = request.Request.Tags;
        video.IsPublic = request.Request.IsPublic;
        video.AllowComments = request.Request.AllowComments;
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

public class DeleteVideoHandler : IRequestHandler<DeleteVideoCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteVideoHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteVideoCommand request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == request.Id && v.CreatorId == request.UserId, cancellationToken);

        if (video == null)
        {
            return Result<bool>.Failure("Video not found or access denied");
        }

        video.IsDeleted = true;
        video.DeletedAt = DateTime.UtcNow;
        video.DeletedBy = request.UserId.ToString();

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}
