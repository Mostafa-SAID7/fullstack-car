namespace Application.Features.Shared.Storage.Models
{
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
}
