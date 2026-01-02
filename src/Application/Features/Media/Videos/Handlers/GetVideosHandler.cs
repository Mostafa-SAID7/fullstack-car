using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Videos.Queries;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class GetVideosHandler : IRequestHandler<GetVideosQuery, Result<PaginatedList<VideoListDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetVideosHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<VideoListDto>>> Handle(GetVideosQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Videos
            .Where(v => !v.IsDeleted && v.Status == MediaStatus.Published && v.IsPublic)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(v => v.Title.Contains(request.SearchTerm) || 
                                   v.Description.Contains(request.SearchTerm) ||
                                   (v.Tags != null && v.Tags.Contains(request.SearchTerm)));
        }

        if (request.CreatorId.HasValue)
        {
            query = query.Where(v => v.CreatorId == request.CreatorId.Value);
        }

        if (request.Quality.HasValue)
        {
            query = query.Where(v => v.Quality == request.Quality.Value);
        }

        if (request.FromDate.HasValue)
        {
            query = query.Where(v => v.PublishedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(v => v.PublishedAt <= request.ToDate.Value);
        }

        // Sorting
        query = request.SortBy.ToLower() switch
        {
            "title" => request.SortDescending ? query.OrderByDescending(v => v.Title) : query.OrderBy(v => v.Title),
            "views" => request.SortDescending ? query.OrderByDescending(v => v.ViewCount) : query.OrderBy(v => v.ViewCount),
            "likes" => request.SortDescending ? query.OrderByDescending(v => v.LikeCount) : query.OrderBy(v => v.LikeCount),
            "published" => request.SortDescending ? query.OrderByDescending(v => v.PublishedAt) : query.OrderBy(v => v.PublishedAt),
            _ => request.SortDescending ? query.OrderByDescending(v => v.CreatedAt) : query.OrderBy(v => v.CreatedAt)
        };

        var videos = await query
            .Select(v => new VideoListDto
            {
                Id = v.Id,
                Title = v.Title,
                Thumbnail = v.Thumbnail,
                Duration = v.Duration,
                ViewCount = v.ViewCount,
                LikeCount = v.LikeCount,
                PublishedAt = v.PublishedAt,
                CreatorId = v.CreatorId
            })
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var totalCount = await query.CountAsync(cancellationToken);

        var paginatedList = new PaginatedList<VideoListDto>(videos, totalCount, request.PageNumber, request.PageSize);

        return Result<PaginatedList<VideoListDto>>.Success(paginatedList);
    }
}

public class GetVideoByIdHandler : IRequestHandler<GetVideoByIdQuery, Result<VideoDetailsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetVideoByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoDetailsDto>> Handle(GetVideoByIdQuery request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .Include(v => v.Comments.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Replies.Where(r => !r.IsDeleted))
            .FirstOrDefaultAsync(v => v.Id == request.Id && !v.IsDeleted, cancellationToken);

        if (video == null)
        {
            return Result<VideoDetailsDto>.Failure("Video not found");
        }

        // Check if user has liked/disliked the video
        bool isLikedByUser = false;
        bool isDislikedByUser = false;

        if (request.UserId.HasValue)
        {
            var userLike = await _context.VideoLikes
                .FirstOrDefaultAsync(l => l.VideoId == request.Id && l.UserId == request.UserId.Value, cancellationToken);

            if (userLike != null)
            {
                isLikedByUser = userLike.IsLike;
                isDislikedByUser = !userLike.IsLike;
            }
        }

        var videoDto = new VideoDetailsDto
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
            UpdatedAt = video.UpdatedAt,
            IsLikedByUser = isLikedByUser,
            IsDislikedByUser = isDislikedByUser,
            Comments = video.Comments.Where(c => c.ParentCommentId == null).Select(c => new VideoCommentDto
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                ParentCommentId = c.ParentCommentId,
                LikeCount = c.LikeCount,
                IsEdited = c.IsEdited,
                CreatedAt = c.CreatedAt,
                EditedAt = c.EditedAt,
                Replies = c.Replies.Select(r => new VideoCommentDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    UserId = r.UserId,
                    ParentCommentId = r.ParentCommentId,
                    LikeCount = r.LikeCount,
                    IsEdited = r.IsEdited,
                    CreatedAt = r.CreatedAt,
                    EditedAt = r.EditedAt
                }).ToList()
            }).ToList()
        };

        return Result<VideoDetailsDto>.Success(videoDto);
    }
}