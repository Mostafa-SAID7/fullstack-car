namespace Application.Common.Interfaces.Documents
{
    public interface IPdfGenerationService
    {
        Task<PdfGenerationResult> GeneratePdfFromHtmlAsync(string html, PdfOptions? options = null, CancellationToken cancellationToken = default);
        Task<PdfGenerationResult> GeneratePdfFromTemplateAsync(string templateName, object model, PdfOptions? options = null, CancellationToken cancellationToken = default);
        Task<PdfGenerationResult> GenerateReportPdfAsync<T>(IEnumerable<T> data, ReportOptions options, CancellationToken cancellationToken = default);
        Task<PdfGenerationResult> MergePdfsAsync(IEnumerable<Stream> pdfStreams, CancellationToken cancellationToken = default);
        Task<PdfGenerationResult> AddWatermarkToPdfAsync(Stream pdfStream, string watermarkText, WatermarkOptions? options = null, CancellationToken cancellationToken = default);
        Task<PdfInfo> GetPdfInfoAsync(Stream pdfStream, CancellationToken cancellationToken = default);
        Task<List<byte[]>> ExtractPdfPagesAsImagesAsync(Stream pdfStream, int dpi = 150, CancellationToken cancellationToken = default);
    }

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

    public class MarginOptions
    {
        public string Top { get; set; } = "1cm";
        public string Right { get; set; } = "1cm";
        public string Bottom { get; set; } = "1cm";
        public string Left { get; set; } = "1cm";
    }

    public class HeaderFooterOptions
    {
        public string? Html { get; set; }
        public string? Height { get; set; }
        public bool ShowPageNumbers { get; set; } = false;
        public string? DateFormat { get; set; }
    }

    public class ReportOptions
    {
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Author { get; set; }
        public List<ReportColumn> Columns { get; set; } = new();
        public ReportStyle Style { get; set; } = new();
        public bool IncludeHeader { get; set; } = true;
        public bool IncludeFooter { get; set; } = true;
        public bool AlternateRowColors { get; set; } = true;
    }

    public class ReportColumn
    {
        public string PropertyName { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public int Width { get; set; } = 100;
        public string Alignment { get; set; } = "Left";
    }

    public class ReportStyle
    {
        public string FontFamily { get; set; } = "Arial";
        public int FontSize { get; set; } = 10;
        public string HeaderBackgroundColor { get; set; } = "#f0f0f0";
        public string AlternateRowColor { get; set; } = "#f9f9f9";
        public string BorderColor { get; set; } = "#cccccc";
    }

    public class WatermarkOptions
    {
        public string Position { get; set; } = "Center";
        public float Opacity { get; set; } = 0.3f;
        public int FontSize { get; set; } = 48;
        public string FontColor { get; set; } = "#cccccc";
        public float Rotation { get; set; } = 45f;
    }

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