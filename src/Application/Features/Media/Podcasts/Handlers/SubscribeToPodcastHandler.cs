using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using Domain.Entities.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class SubscribeToPodcastHandler : IRequestHandler<SubscribeToPodcastCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public SubscribeToPodcastHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(SubscribeToPodcastCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if podcast exists
            var podcast = await _context.Podcasts
                .FirstOrDefaultAsync(p => p.Id == request.PodcastId, cancellationToken);

            if (podcast == null)
            {
                return Result<bool>.Failure(new[] { "Podcast not found" });
            }

            // Check if already subscribed
            var existingSubscription = await _context.PodcastSubscriptions
                .FirstOrDefaultAsync(s => s.PodcastId == request.PodcastId && s.UserId == request.UserId, cancellationToken);

            if (existingSubscription != null)
            {
                if (existingSubscription.IsActive)
                {
                    return Result<bool>.Failure(new[] { "Already subscribed to this podcast" });
                }
                
                // Reactivate subscription
                existingSubscription.IsActive = true;
                existingSubscription.UnsubscribedAt = null;
                existingSubscription.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Create new subscription
                var subscription = new PodcastSubscription
                {
                    PodcastId = request.PodcastId,
                    UserId = request.UserId,
                    IsActive = true
                };

                _context.PodcastSubscriptions.Add(subscription);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(new[] { $"Error subscribing to podcast: {ex.Message}" });
        }
    }
}