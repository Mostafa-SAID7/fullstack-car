using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class UpdatePodcastFileHandler : IRequestHandler<UpdatePodcastFileCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public UpdatePodcastFileHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(UpdatePodcastFileCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var podcast = await _context.Podcasts
                .FirstOrDefaultAsync(p => p.Id == request.PodcastId, cancellationToken);

            if (podcast == null)
            {
                return Result<bool>.Failure(new[] { "Podcast not found" });
            }

            podcast.AudioUrl = request.AudioUrl;
            podcast.FileSize = request.FileSize;
            podcast.Duration = request.Duration;
            podcast.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(new[] { $"Error updating podcast file: {ex.Message}" });
        }
    }
}
