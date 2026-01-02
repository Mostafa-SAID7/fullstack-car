using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class LikePodcastHandler : IRequestHandler<LikePodcastCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public LikePodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(LikePodcastCommand request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .FirstOrDefaultAsync(p => p.Id == request.PodcastId && !p.IsDeleted, cancellationToken);

        if (podcast == null)
        {
            return Result<bool>.Failure("Podcast not found");
        }

        var existingLike = await _context.PodcastLikes
            .FirstOrDefaultAsync(l => l.PodcastId == request.PodcastId && l.UserId == request.UserId, cancellationToken);

        if (existingLike != null)
        {
            // Remove like if already exists
            _context.PodcastLikes.Remove(existingLike);
        }
        else
        {
            // Create new like
            var newLike = new PodcastLike
            {
                PodcastId = request.PodcastId,
                UserId = request.UserId
            };
            _context.PodcastLikes.Add(newLike);
        }

        // Update podcast like count
        var likeCount = await _context.PodcastLikes
            .CountAsync(l => l.PodcastId == request.PodcastId, cancellationToken);

        if (existingLike == null)
        {
            likeCount++; // Account for the new like we just added
        }

        podcast.LikeCount = likeCount;
        podcast.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

public class AddPodcastCommentHandler : IRequestHandler<AddPodcastCommentCommand, Result<PodcastCommentDto>>
{
    private readonly IApplicationDbContext _context;

    public AddPodcastCommentHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastCommentDto>> Handle(AddPodcastCommentCommand request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .FirstOrDefaultAsync(p => p.Id == request.PodcastId && !p.IsDeleted, cancellationToken);

        if (podcast == null)
        {
            return Result<PodcastCommentDto>.Failure("Podcast not found");
        }

        if (!podcast.AllowComments)
        {
            return Result<PodcastCommentDto>.Failure("Comments are disabled for this podcast");
        }

        // Validate parent comment if provided
        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await _context.PodcastComments
                .FirstOrDefaultAsync(c => c.Id == request.ParentCommentId.Value && c.PodcastId == request.PodcastId, cancellationToken);

            if (parentComment == null)
            {
                return Result<PodcastCommentDto>.Failure("Parent comment not found");
            }
        }

        var comment = new PodcastComment
        {
            Content = request.Content,
            PodcastId = request.PodcastId,
            UserId = request.UserId,
            ParentCommentId = request.ParentCommentId
        };

        _context.PodcastComments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        var commentDto = new PodcastCommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            UserId = comment.UserId,
            ParentCommentId = comment.ParentCommentId,
            LikeCount = comment.LikeCount,
            IsEdited = comment.IsEdited,
            CreatedAt = comment.CreatedAt,
            EditedAt = comment.EditedAt,
            Replies = new List<PodcastCommentDto>()
        };

        return Result<PodcastCommentDto>.Success(commentDto);
    }
}

public class CreatePodcastSeriesHandler : IRequestHandler<CreatePodcastSeriesCommand, Result<PodcastSeriesDto>>
{
    private readonly IApplicationDbContext _context;

    public CreatePodcastSeriesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastSeriesDto>> Handle(CreatePodcastSeriesCommand request, CancellationToken cancellationToken)
    {
        var series = new PodcastSeries
        {
            Name = request.Request.Name,
            Description = request.Request.Description,
            CoverImage = request.Request.CoverImage,
            Category = request.Request.Category,
            Language = request.Request.Language,
            CreatorId = request.CreatorId,
            IsActive = true
        };

        _context.PodcastSeries.Add(series);
        await _context.SaveChangesAsync(cancellationToken);

        var seriesDto = new PodcastSeriesDto
        {
            Id = series.Id,
            Name = series.Name,
            Description = series.Description,
            CoverImage = series.CoverImage,
            IsActive = series.IsActive,
            Category = series.Category,
            Language = series.Language,
            CreatorId = series.CreatorId,
            EpisodeCount = 0,
            CreatedAt = series.CreatedAt
        };

        return Result<PodcastSeriesDto>.Success(seriesDto);
    }
}