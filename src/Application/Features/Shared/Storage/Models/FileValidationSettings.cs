namespace Application.Features.Shared.Storage.Models
{
    public class FileValidationSettings
    {
        public long MaxFileSize { get; set; } = 10 * 1024 * 1024; // 10MB
        public List<string> AllowedExtensions { get; set; } = new();
        public List<string> AllowedMimeTypes { get; set; } = new();
        public List<string> BlockedExtensions { get; set; } = new();
        public bool ScanForViruses { get; set; } = false;
        public bool ValidateImageDimensions { get; set; } = false;
        public int MaxImageWidth { get; set; } = 4000;
        public int MaxImageHeight { get; set; } = 4000;
    }
}