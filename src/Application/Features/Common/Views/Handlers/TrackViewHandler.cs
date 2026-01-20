using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Views.Commands;
using Domain.Entities.Common;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Views.Handlers;

public class TrackViewHandler : IRequestHandler<TrackViewCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public TrackViewHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(TrackViewCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if this is a duplicate view (same user/IP within a short time frame)
            var recentView = await _context.Views
                .Where(v => v.ContentId == request.ContentId && 
                           v.ContentType == request.ContentType &&
                           v.CreatedAt > DateTime.UtcNow.AddMinutes(-5))
                .Where(v => (request.UserId.HasValue && v.UserId == request.UserId) ||
                           (!string.IsNullOrEmpty(request.IpAddress) && v.IpAddress == request.IpAddress))
                .FirstOrDefaultAsync(cancellationToken);

            if (recentView != null)
            {
                // Don't count duplicate views within 5 minutes
                return Result<bool>.Success(false);
            }

            // Create new view record
            var view = new View
            {
                ContentId = request.ContentId,
                ContentType = request.ContentType,
                UserId = request.UserId,
                IpAddress = request.IpAddress,
                UserAgent = request.UserAgent,
                CreatedAt = DateTime.UtcNow
            };

            _context.Views.Add(view);

            // Update content view count
            await UpdateContentViewCount(request.ContentId, request.ContentType, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to track view: {ex.Message}");
        }
    }

    private async Task UpdateContentViewCount(Guid contentId, ContentType contentType, CancellationToken cancellationToken)
    {
        switch (contentType)
        {
            case ContentType.Question:
                var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == contentId, cancellationToken);
                if (question != null)
                {
                    question.ViewsCount++;
                }
                break;
            case ContentType.Post:
                var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == contentId, cancellationToken);
                if (post != null)
                {
                    post.ViewsCount++;
                }
                break;
            case ContentType.Guide:
                var guide = await _context.Guides.FirstOrDefaultAsync(g => g.Id == contentId, cancellationToken);
                if (guide != null)
                {
                    guide.ViewCount++;
                }
                break;
            case ContentType.Page:
                // Update page view count if needed
                break;
            case ContentType.Article:
                // Update article view count if needed
                break;
        }
    }
}