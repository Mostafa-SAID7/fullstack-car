using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class DeletePodcastSeriesHandler : IRequestHandler<DeletePodcastSeriesCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeletePodcastSeriesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeletePodcastSeriesCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var series = await _context.PodcastSeries
                .Include(s => s.Episodes)
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (series == null)
            {
                return Result<bool>.Failure(new[] { "Podcast series not found" });
            }

            if (series.CreatorId != request.UserId)
            {
                return Result<bool>.Failure(new[] { "You don't have permission to delete this series" });
            }

            // Check if series has episodes
            if (series.Episodes.Any())
            {
                return Result<bool>.Failure(new[] { "Cannot delete series that contains episodes. Please delete all episodes first." });
            }

            _context.PodcastSeries.Remove(series);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(new[] { $"Error deleting podcast series: {ex.Message}" });
        }
    }
}