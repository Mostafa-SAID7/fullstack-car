using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Responses;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class AddVideoCommentHandler : IRequestHandler<AddVideoCommentCommand, Result<VideoCommentDto>>
{
    private readonly IApplicationDbContext _context;

    public AddVideoCommentHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<VideoCommentDto>> Handle(AddVideoCommentCommand request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == request.VideoId && !v.IsDeleted, cancellationToken);

        if (video == null)
        {
            return Result<VideoCommentDto>.Failure("Video not found");
        }

        if (!video.AllowComments)
        {
            return Result<VideoCommentDto>.Failure("Comments are disabled for this video");
        }

        // Validate parent comment if provided
        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await _context.VideoComments
                .FirstOrDefaultAsync(c => c.Id == request.ParentCommentId.Value && c.VideoId == request.VideoId, cancellationToken);

            if (parentComment == null)
            {
                return Result<VideoCommentDto>.Failure("Parent comment not found");
            }
        }

        var comment = new VideoComment
        {
            Content = request.Content,
            VideoId = request.VideoId,
            UserId = request.UserId,
            ParentCommentId = request.ParentCommentId
        };

        _context.VideoComments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        var commentDto = new VideoCommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            UserId = comment.UserId,
            ParentCommentId = comment.ParentCommentId,
            LikeCount = comment.LikeCount,
            IsEdited = comment.IsEdited,
            CreatedAt = comment.CreatedAt,
            EditedAt = comment.EditedAt,
            Replies = new List<VideoCommentDto>()
        };

        return Result<VideoCommentDto>.Success(commentDto);
    }
}