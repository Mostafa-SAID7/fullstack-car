namespace Application.Features.Shared.Documents.Models
{
    public class PdfOptions
    {
        public string PageSize { get; set; } = "A4";
        public string Orientation { get; set; } = "Portrait";
        public MarginOptions Margins { get; set; } = new();
        public HeaderFooterOptions? Header { get; set; }
        public HeaderFooterOptions? Footer { get; set; }
        public bool EnableJavaScript { get; set; } = false;
        public bool EnableImages { get; set; } = true;
        public int Quality { get; set; } = 100;
        public string? BaseUrl { get; set; }
        public Dictionary<string, string> CustomHeaders { get; set; } = new();
    }
}
