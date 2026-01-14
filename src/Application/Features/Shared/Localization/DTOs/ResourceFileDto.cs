namespace Application.Features.Shared.Localization.DTOs
{
    public class ResourceFileDto
    {
        public string FileName { get; set; } = string.Empty;
        public string Feature { get; set; } = string.Empty;
        public string Culture { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public long Size { get; set; }
        public DateTime LastModified { get; set; }
        public bool Exists { get; set; }
        public int KeyCount { get; set; }
    }
}
