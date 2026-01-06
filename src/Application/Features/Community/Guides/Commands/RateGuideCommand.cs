using Application.Common.Interfaces;
using Application.Features.Community.Guides.DTOs.Requests;
using Domain.Entities.Community.Guides;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Commands;

public record RateGuideCommand(RateGuideRequest Request, Guid UserId) : IRequest<bool>;

public class RateGuideCommandHandler : IRequestHandler<RateGuideCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RateGuideCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RateGuideCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.Guides
            .FirstOrDefaultAsync(g => g.Id == request.Request.GuideId, cancellationToken);

        if (guide == null)
            return false;

        var existingRating = await _context.GuideRatings
            .FirstOrDefaultAsync(r => r.GuideId == request.Request.GuideId && r.UserId == request.UserId, cancellationToken);

        if (existingRating != null)
        {
            // Update existing rating
            existingRating.Rating = request.Request.Rating;
            existingRating.Comment = request.Request.Comment;
            existingRating.IsHelpful = request.Request.IsHelpful;
        }
        else
        {
            // Create new rating
            var rating = new GuideRating
            {
                GuideId = request.Request.GuideId,
                UserId = request.UserId,
                Rating = request.Request.Rating,
                Comment = request.Request.Comment,
                IsHelpful = request.Request.IsHelpful
            };

            _context.GuideRatings.Add(rating);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
