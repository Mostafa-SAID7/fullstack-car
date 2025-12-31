using Application.Features.Shared.Storage.Models;

namespace Application.Features.Shared.Storage.Interfaces
{
    public interface IImageProcessingService
    {
        Task<ImageProcessingResult> ResizeImageAsync(Stream imageStream, int width, int height, string outputPath, CancellationToken cancellationToken = default);
        Task<ImageProcessingResult> CreateThumbnailAsync(Stream imageStream, int size, string outputPath, CancellationToken cancellationToken = default);
        Task<ImageProcessingResult> CropImageAsync(Stream imageStream, int x, int y, int width, int height, string outputPath, CancellationToken cancellationToken = default);
        Task<ImageProcessingResult> WatermarkImageAsync(Stream imageStream, string watermarkPath, string outputPath, WatermarkPosition position = WatermarkPosition.BottomRight, CancellationToken cancellationToken = default);
        Task<ImageProcessingResult> ConvertFormatAsync(Stream imageStream, ImageFormat format, string outputPath, CancellationToken cancellationToken = default);
        Task<ImageInfo> GetImageInfoAsync(Stream imageStream, CancellationToken cancellationToken = default);
        Task<bool> ValidateImageAsync(Stream imageStream, ImageValidationSettings settings, CancellationToken cancellationToken = default);
        Task<ImageProcessingResult> OptimizeImageAsync(Stream imageStream, string outputPath, int quality = 85, CancellationToken cancellationToken = default);
    }
}