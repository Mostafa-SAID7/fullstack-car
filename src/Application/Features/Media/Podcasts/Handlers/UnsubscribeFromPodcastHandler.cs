using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class UnsubscribeFromPodcastHandler : IRequestHandler<UnsubscribeFromPodcastCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public UnsubscribeFromPodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(UnsubscribeFromPodcastCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var subscription = await _context.PodcastSubscriptions
                .FirstOrDefaultAsync(s => s.PodcastId == request.PodcastId && s.UserId == request.UserId && s.IsActive, cancellationToken);

            if (subscription == null)
            {
                return Result<bool>.Failure(new[] { "Subscription not found or already inactive" });
            }

            subscription.IsActive = false;
            subscription.UnsubscribedAt = DateTime.UtcNow;
            subscription.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(new[] { $"Error unsubscribing from podcast: {ex.Message}" });
        }
    }
}