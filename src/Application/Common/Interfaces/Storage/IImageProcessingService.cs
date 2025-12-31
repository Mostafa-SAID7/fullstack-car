namespace Application.Common.Interfaces.Storage
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

    public class ImageProcessingResult
    {
        public bool Success { get; set; }
        public string? OutputPath { get; set; }
        public long FileSize { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class ImageInfo
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public string Format { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public int BitDepth { get; set; }
        public bool HasTransparency { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class ImageValidationSettings
    {
        public int MinWidth { get; set; } = 1;
        public int MinHeight { get; set; } = 1;
        public int MaxWidth { get; set; } = 4000;
        public int MaxHeight { get; set; } = 4000;
        public List<ImageFormat> AllowedFormats { get; set; } = new() { ImageFormat.Jpeg, ImageFormat.Png, ImageFormat.Gif, ImageFormat.WebP };
        public long MaxFileSize { get; set; } = 10 * 1024 * 1024; // 10MB
    }

    public enum ImageFormat
    {
        Jpeg,
        Png,
        Gif,
        WebP,
        Bmp,
        Tiff
    }

    public enum WatermarkPosition
    {
        TopLeft,
        TopCenter,
        TopRight,
        MiddleLeft,
        MiddleCenter,
        MiddleRight,
        BottomLeft,
        BottomCenter,
        BottomRight
    }
}