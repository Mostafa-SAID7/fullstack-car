namespace Application.Features.Shared.Storage.Models
{
    public class ImageValidationSettings
    {
        public int MinWidth { get; set; } = 1;
        public int MinHeight { get; set; } = 1;
        public int MaxWidth { get; set; } = 4000;
        public int MaxHeight { get; set; } = 4000;
        public List<ImageFormat> AllowedFormats { get; set; } = new() { ImageFormat.Jpeg, ImageFormat.Png, ImageFormat.Gif, ImageFormat.WebP };
        public long MaxFileSize { get; set; } = 10 * 1024 * 1024; // 10MB
    }
}
