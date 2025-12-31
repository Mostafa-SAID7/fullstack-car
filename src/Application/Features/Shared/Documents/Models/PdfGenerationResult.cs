namespace Application.Features.Shared.Documents.Models
{
    public class PdfGenerationResult
    {
        public bool Success { get; set; }
        public byte[]? PdfData { get; set; }
        public string? FilePath { get; set; }
        public long FileSize { get; set; }
        public int PageCount { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
    }
}