namespace Application.Features.Shared.Documents.DTOs.Requests
{
    public class PdfFromHtmlRequest
    {
        public string? Html { get; set; }
        public string? FileName { get; set; }
        public string? PageSize { get; set; }
        public string? Orientation { get; set; }
        public string? MarginTop { get; set; }
        public string? MarginRight { get; set; }
        public string? MarginBottom { get; set; }
        public string? MarginLeft { get; set; }
        public string? HeaderHtml { get; set; }
        public string? HeaderHeight { get; set; }
        public string? FooterHtml { get; set; }
        public string? FooterHeight { get; set; }
        public bool? ShowPageNumbers { get; set; }
        public bool? EnableJavaScript { get; set; }
        public bool? EnableImages { get; set; }
        public int? Quality { get; set; }
    }
}