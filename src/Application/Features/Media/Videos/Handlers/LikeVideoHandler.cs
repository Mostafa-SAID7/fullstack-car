using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.Commands;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class LikeVideoHandler : IRequestHandler<LikeVideoCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public LikeVideoHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(LikeVideoCommand request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .FirstOrDefaultAsync(v => v.Id == request.VideoId && !v.IsDeleted, cancellationToken);

        if (video == null)
        {
            return Result<bool>.Failure("Video not found");
        }

        var existingLike = await _context.VideoLikes
            .FirstOrDefaultAsync(l => l.VideoId == request.VideoId && l.UserId == request.UserId, cancellationToken);

        if (existingLike != null)
        {
            // Update existing like/dislike
            if (existingLike.IsLike != request.IsLike)
            {
                existingLike.IsLike = request.IsLike;
                existingLike.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Remove like/dislike if same action
                _context.VideoLikes.Remove(existingLike);
            }
        }
        else
        {
            // Create new like/dislike
            var newLike = new VideoLike
            {
                VideoId = request.VideoId,
                UserId = request.UserId,
                IsLike = request.IsLike
            };
            _context.VideoLikes.Add(newLike);
        }

        // Update video counts
        var likeCount = await _context.VideoLikes
            .CountAsync(l => l.VideoId == request.VideoId && l.IsLike, cancellationToken);
        var dislikeCount = await _context.VideoLikes
            .CountAsync(l => l.VideoId == request.VideoId && !l.IsLike, cancellationToken);

        video.LikeCount = likeCount;
        video.DislikeCount = dislikeCount;
        video.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}
