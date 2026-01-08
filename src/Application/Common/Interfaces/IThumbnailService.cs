using Application.Common.Models;

namespace Application.Common.Interfaces;

public interface IThumbnailService
{
    Task<ThumbnailResult> GenerateVideoThumbnailAsync(Stream videoStream, string fileName, TimeSpan? timeOffset = null, CancellationToken cancellationToken = default);
    Task<ThumbnailResult> GenerateImageThumbnailAsync(Stream imageStream, string fileName, int width = 300, int height = 200, CancellationToken cancellationToken = default);
    Task<ThumbnailResult> GenerateAudioThumbnailAsync(string title, string? description = null, CancellationToken cancellationToken = default);
    Task<bool> DeleteThumbnailAsync(string thumbnailUrl, CancellationToken cancellationToken = default);
}