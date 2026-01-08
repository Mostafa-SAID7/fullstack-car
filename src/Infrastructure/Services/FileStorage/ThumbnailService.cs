using Application.Common.Interfaces;
using Application.Common.Models;
using FFMpegCore;
using Infrastructure.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Services.FileStorage;

public class ThumbnailService : IThumbnailService
{
    private readonly FileStorageSettings _settings;
    private readonly IMediaFileStorageService _fileStorageService;
    private readonly ILogger<ThumbnailService> _logger;

    public ThumbnailService(
        IOptions<FileStorageSettings> settings,
        IMediaFileStorageService fileStorageService,
        ILogger<ThumbnailService> logger)
    {
        _settings = settings.Value;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<ThumbnailResult> GenerateVideoThumbnailAsync(Stream videoStream, string fileName, TimeSpan? timeOffset = null, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_settings.EnableThumbnails)
            {
                return ThumbnailResult.Failure("Thumbnail generation is disabled");
            }

            // Create temporary files for processing
            var tempVideoPath = Path.GetTempFileName();
            var tempThumbnailPath = Path.GetTempFileName();
            var extension = Path.GetExtension(fileName);
            var videoTempPath = Path.ChangeExtension(tempVideoPath, extension);
            var thumbnailTempPath = Path.ChangeExtension(tempThumbnailPath, ".jpg");

            try
            {
                // Copy video stream to temporary file
                using (var fileStream = new FileStream(videoTempPath, FileMode.Create))
                {
                    videoStream.Position = 0;
                    await videoStream.CopyToAsync(fileStream, cancellationToken);
                }

                // Get video information to determine thumbnail time
                var mediaInfo = await FFProbe.AnalyseAsync(videoTempPath, cancellationToken: cancellationToken);
                var thumbnailTime = timeOffset ?? TimeSpan.FromSeconds(Math.Min(10, mediaInfo.Duration.TotalSeconds / 2));

                // Generate thumbnail using FFMpeg
                await FFMpeg.SnapshotAsync(
                    videoTempPath,
                    thumbnailTempPath,
                    new System.Drawing.Size(_settings.ThumbnailWidth, _settings.ThumbnailHeight),
                    thumbnailTime);

                // Optimize the thumbnail image
                using var thumbnailStream = new FileStream(thumbnailTempPath, FileMode.Open);
                var optimizedThumbnailStream = await OptimizeImageAsync(thumbnailStream, _settings.ThumbnailWidth, _settings.ThumbnailHeight, cancellationToken);

                // Generate unique thumbnail filename
                var thumbnailFileName = GenerateThumbnailFileName(fileName, "video");

                // Upload thumbnail to storage
                var uploadResult = await _fileStorageService.UploadImageAsync(optimizedThumbnailStream, thumbnailFileName, "image/jpeg", cancellationToken);

                if (uploadResult.IsSuccess)
                {
                    _logger.LogInformation("Video thumbnail generated successfully: {FileName} -> {ThumbnailUrl}", fileName, uploadResult.FileUrl);
                    return ThumbnailResult.Success(uploadResult.FileUrl!, thumbnailFileName, _settings.ThumbnailWidth, _settings.ThumbnailHeight, uploadResult.FileSize);
                }
                else
                {
                    return ThumbnailResult.Failure($"Failed to upload thumbnail: {uploadResult.ErrorMessage}");
                }
            }
            finally
            {
                // Clean up temporary files
                CleanupTempFile(tempVideoPath);
                CleanupTempFile(videoTempPath);
                CleanupTempFile(tempThumbnailPath);
                CleanupTempFile(thumbnailTempPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating video thumbnail: {FileName}", fileName);
            return ThumbnailResult.Failure($"Failed to generate video thumbnail: {ex.Message}");
        }
    }

    public async Task<ThumbnailResult> GenerateImageThumbnailAsync(Stream imageStream, string fileName, int width = 300, int height = 200, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_settings.EnableThumbnails)
            {
                return ThumbnailResult.Failure("Thumbnail generation is disabled");
            }

            // Generate thumbnail from image
            var thumbnailStream = await OptimizeImageAsync(imageStream, width, height, cancellationToken);

            // Generate unique thumbnail filename
            var thumbnailFileName = GenerateThumbnailFileName(fileName, "image");

            // Upload thumbnail to storage
            var uploadResult = await _fileStorageService.UploadImageAsync(thumbnailStream, thumbnailFileName, "image/jpeg", cancellationToken);

            if (uploadResult.IsSuccess)
            {
                _logger.LogInformation("Image thumbnail generated successfully: {FileName} -> {ThumbnailUrl}", fileName, uploadResult.FileUrl);
                return ThumbnailResult.Success(uploadResult.FileUrl!, thumbnailFileName, width, height, uploadResult.FileSize);
            }
            else
            {
                return ThumbnailResult.Failure($"Failed to upload thumbnail: {uploadResult.ErrorMessage}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating image thumbnail: {FileName}", fileName);
            return ThumbnailResult.Failure($"Failed to generate image thumbnail: {ex.Message}");
        }
    }

    public async Task<ThumbnailResult> GenerateAudioThumbnailAsync(string title, string? description = null, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!_settings.EnableThumbnails)
            {
                return ThumbnailResult.Failure("Thumbnail generation is disabled");
            }

            // Generate a simple audio thumbnail with text
            var thumbnailStream = await GenerateTextThumbnailAsync(title, description, _settings.ThumbnailWidth, _settings.ThumbnailHeight, cancellationToken);

            // Generate unique thumbnail filename
            var thumbnailFileName = GenerateThumbnailFileName($"{title}.jpg", "audio");

            // Upload thumbnail to storage
            var uploadResult = await _fileStorageService.UploadImageAsync(thumbnailStream, thumbnailFileName, "image/jpeg", cancellationToken);

            if (uploadResult.IsSuccess)
            {
                _logger.LogInformation("Audio thumbnail generated successfully: {Title} -> {ThumbnailUrl}", title, uploadResult.FileUrl);
                return ThumbnailResult.Success(uploadResult.FileUrl!, thumbnailFileName, _settings.ThumbnailWidth, _settings.ThumbnailHeight, uploadResult.FileSize);
            }
            else
            {
                return ThumbnailResult.Failure($"Failed to upload thumbnail: {uploadResult.ErrorMessage}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating audio thumbnail: {Title}", title);
            return ThumbnailResult.Failure($"Failed to generate audio thumbnail: {ex.Message}");
        }
    }

    public async Task<bool> DeleteThumbnailAsync(string thumbnailUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _fileStorageService.DeleteFileAsync(thumbnailUrl, cancellationToken);
            
            if (result)
            {
                _logger.LogInformation("Thumbnail deleted successfully: {ThumbnailUrl}", thumbnailUrl);
            }
            else
            {
                _logger.LogWarning("Failed to delete thumbnail: {ThumbnailUrl}", thumbnailUrl);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting thumbnail: {ThumbnailUrl}", thumbnailUrl);
            return false;
        }
    }

    private async Task<Stream> OptimizeImageAsync(Stream imageStream, int width, int height, CancellationToken cancellationToken)
    {
        imageStream.Position = 0;
        
        using var image = await Image.LoadAsync(imageStream, cancellationToken);
        
        // Resize image maintaining aspect ratio
        image.Mutate(x => x.Resize(new ResizeOptions
        {
            Size = new Size(width, height),
            Mode = ResizeMode.Crop,
            Position = AnchorPositionMode.Center
        }));

        var outputStream = new MemoryStream();
        
        // Save as JPEG with specified quality
        var encoder = new JpegEncoder
        {
            Quality = _settings.ImageQuality
        };
        
        await image.SaveAsync(outputStream, encoder, cancellationToken);
        outputStream.Position = 0;
        
        return outputStream;
    }

    private async Task<Stream> GenerateTextThumbnailAsync(string title, string? description, int width, int height, CancellationToken cancellationToken)
    {
        // Create a simple text-based thumbnail for audio files
        using var image = new Image<SixLabors.ImageSharp.PixelFormats.Rgb24>(width, height);
        
        // Fill with solid background
        image.Mutate(ctx =>
        {
            // Create a simple solid background
            ctx.BackgroundColor(Color.FromRgb(45, 55, 72)); // Dark blue-gray background
        });

        // Add audio icon (simple representation)
        image.Mutate(ctx =>
        {
            var centerX = width / 2;
            var centerY = height / 2 - 20;
            var iconSize = Math.Min(width, height) / 4;
            
            // Draw a simple rectangle for audio icon
            ctx.BackgroundColor(Color.White);
        });

        var outputStream = new MemoryStream();
        
        var encoder = new JpegEncoder
        {
            Quality = _settings.ImageQuality
        };
        
        await image.SaveAsync(outputStream, encoder, cancellationToken);
        outputStream.Position = 0;
        
        return outputStream;
    }

    private string GenerateThumbnailFileName(string originalFileName, string mediaType)
    {
        var nameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);
        var uniqueId = Guid.NewGuid().ToString("N")[..8];
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        return $"thumb_{mediaType}_{timestamp}_{uniqueId}.jpg";
    }

    private void CleanupTempFile(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to cleanup temporary file: {FilePath}", filePath);
        }
    }
}