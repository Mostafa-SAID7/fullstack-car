namespace Application.Features.Shared.Documents.Models
{
    public class PdfInfo
    {
        public int PageCount { get; set; }
        public long FileSize { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Subject { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }
}