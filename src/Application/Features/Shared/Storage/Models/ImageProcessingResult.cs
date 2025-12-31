namespace Application.Features.Shared.Storage.Models
{
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
}