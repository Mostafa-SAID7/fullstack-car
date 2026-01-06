using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class UpdateVideoFileHandler : IRequestHandler<UpdateVideoFileCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public UpdateVideoFileHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(UpdateVideoFileCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var video = await _context.Videos
                .FirstOrDefaultAsync(v => v.Id == request.VideoId, cancellationToken);

            if (video == null)
            {
                return Result<bool>.Failure(new[] { "Video not found" });
            }

            video.VideoUrl = request.VideoUrl;
            video.FileSize = request.FileSize;
            video.Duration = request.Duration;
            video.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(new[] { $"Error updating video file: {ex.Message}" });
        }
    }
}
