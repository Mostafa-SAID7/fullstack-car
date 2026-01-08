using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Responses;
using Domain.Entities.Media;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Media.Videos.Handlers;

public class BulkDeleteVideosHandler : IRequestHandler<BulkDeleteVideosCommand, Result<BulkOperationResult>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<BulkDeleteVideosHandler> _logger;

    public BulkDeleteVideosHandler(IApplicationDbContext context, ILogger<BulkDeleteVideosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<BulkOperationResult>> Handle(BulkDeleteVideosCommand request, CancellationToken cancellationToken)
    {
        var result = new BulkOperationResult
        {
            TotalRequested = request.VideoIds.Count
        };

        try
        {
            var videos = await _context.Videos
                .Where(v => request.VideoIds.Contains(v.Id) && v.CreatorId == request.UserId)
                .ToListAsync(cancellationToken);

            foreach (var videoId in request.VideoIds)
            {
                var video = videos.FirstOrDefault(v => v.Id == videoId);
                if (video == null)
                {
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Video not found or access denied"
                    });
                    result.FailureCount++;
                    continue;
                }

                try
                {
                    _context.Videos.Remove(video);
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deleting video {VideoId}", videoId);
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Failed to delete video"
                    });
                    result.FailureCount++;
                }
            }

            if (result.SuccessCount > 0)
            {
                await _context.SaveChangesAsync(cancellationToken);
            }

            return Result<BulkOperationResult>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk delete videos operation");
            return Result<BulkOperationResult>.Failure("An error occurred during bulk delete operation");
        }
    }
}

public class BulkPublishVideosHandler : IRequestHandler<BulkPublishVideosCommand, Result<BulkOperationResult>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<BulkPublishVideosHandler> _logger;

    public BulkPublishVideosHandler(IApplicationDbContext context, ILogger<BulkPublishVideosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<BulkOperationResult>> Handle(BulkPublishVideosCommand request, CancellationToken cancellationToken)
    {
        var result = new BulkOperationResult
        {
            TotalRequested = request.VideoIds.Count
        };

        try
        {
            var videos = await _context.Videos
                .Where(v => request.VideoIds.Contains(v.Id) && v.CreatorId == request.UserId)
                .ToListAsync(cancellationToken);

            foreach (var videoId in request.VideoIds)
            {
                var video = videos.FirstOrDefault(v => v.Id == videoId);
                if (video == null)
                {
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Video not found or access denied"
                    });
                    result.FailureCount++;
                    continue;
                }

                try
                {
                    if (video.Status == MediaStatus.Draft)
                    {
                        video.Status = MediaStatus.Published;
                        video.PublishedAt = DateTime.UtcNow;
                        video.UpdatedAt = DateTime.UtcNow;
                        result.SuccessCount++;
                    }
                    else
                    {
                        result.Errors.Add(new BulkOperationError
                        {
                            ItemId = videoId,
                            Error = "Video is already published or cannot be published"
                        });
                        result.FailureCount++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error publishing video {VideoId}", videoId);
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Failed to publish video"
                    });
                    result.FailureCount++;
                }
            }

            if (result.SuccessCount > 0)
            {
                await _context.SaveChangesAsync(cancellationToken);
            }

            return Result<BulkOperationResult>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk publish videos operation");
            return Result<BulkOperationResult>.Failure("An error occurred during bulk publish operation");
        }
    }
}

public class BulkUnpublishVideosHandler : IRequestHandler<BulkUnpublishVideosCommand, Result<BulkOperationResult>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<BulkUnpublishVideosHandler> _logger;

    public BulkUnpublishVideosHandler(IApplicationDbContext context, ILogger<BulkUnpublishVideosHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<BulkOperationResult>> Handle(BulkUnpublishVideosCommand request, CancellationToken cancellationToken)
    {
        var result = new BulkOperationResult
        {
            TotalRequested = request.VideoIds.Count
        };

        try
        {
            var videos = await _context.Videos
                .Where(v => request.VideoIds.Contains(v.Id) && v.CreatorId == request.UserId)
                .ToListAsync(cancellationToken);

            foreach (var videoId in request.VideoIds)
            {
                var video = videos.FirstOrDefault(v => v.Id == videoId);
                if (video == null)
                {
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Video not found or access denied"
                    });
                    result.FailureCount++;
                    continue;
                }

                try
                {
                    if (video.Status == MediaStatus.Published)
                    {
                        video.Status = MediaStatus.Draft;
                        video.UpdatedAt = DateTime.UtcNow;
                        result.SuccessCount++;
                    }
                    else
                    {
                        result.Errors.Add(new BulkOperationError
                        {
                            ItemId = videoId,
                            Error = "Video is not published or cannot be unpublished"
                        });
                        result.FailureCount++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error unpublishing video {VideoId}", videoId);
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Failed to unpublish video"
                    });
                    result.FailureCount++;
                }
            }

            if (result.SuccessCount > 0)
            {
                await _context.SaveChangesAsync(cancellationToken);
            }

            return Result<BulkOperationResult>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk unpublish videos operation");
            return Result<BulkOperationResult>.Failure("An error occurred during bulk unpublish operation");
        }
    }
}

public class BulkUpdateVideoMetadataHandler : IRequestHandler<BulkUpdateVideoMetadataCommand, Result<BulkOperationResult>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<BulkUpdateVideoMetadataHandler> _logger;

    public BulkUpdateVideoMetadataHandler(IApplicationDbContext context, ILogger<BulkUpdateVideoMetadataHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<BulkOperationResult>> Handle(BulkUpdateVideoMetadataCommand request, CancellationToken cancellationToken)
    {
        var result = new BulkOperationResult
        {
            TotalRequested = request.VideoIds.Count
        };

        try
        {
            var videos = await _context.Videos
                .Where(v => request.VideoIds.Contains(v.Id) && v.CreatorId == request.UserId)
                .ToListAsync(cancellationToken);

            foreach (var videoId in request.VideoIds)
            {
                var video = videos.FirstOrDefault(v => v.Id == videoId);
                if (video == null)
                {
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Video not found or access denied"
                    });
                    result.FailureCount++;
                    continue;
                }

                try
                {
                    if (request.Metadata.Tags != null)
                    {
                        video.Tags = string.Join(",", request.Metadata.Tags);
                    }

                    if (request.Metadata.IsPublic.HasValue)
                    {
                        video.IsPublic = request.Metadata.IsPublic.Value;
                    }

                    if (request.Metadata.AllowComments.HasValue)
                    {
                        video.AllowComments = request.Metadata.AllowComments.Value;
                    }

                    // Note: Category property doesn't exist on Video entity
                    // If needed, this would require adding the property to the entity first

                    video.UpdatedAt = DateTime.UtcNow;
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating video metadata {VideoId}", videoId);
                    result.Errors.Add(new BulkOperationError
                    {
                        ItemId = videoId,
                        Error = "Failed to update video metadata"
                    });
                    result.FailureCount++;
                }
            }

            if (result.SuccessCount > 0)
            {
                await _context.SaveChangesAsync(cancellationToken);
            }

            return Result<BulkOperationResult>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk update video metadata operation");
            return Result<BulkOperationResult>.Failure("An error occurred during bulk update operation");
        }
    }
}