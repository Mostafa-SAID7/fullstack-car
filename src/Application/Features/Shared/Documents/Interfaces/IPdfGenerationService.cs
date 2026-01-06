using Application.Features.Shared.Documents.Models;

namespace Application.Features.Shared.Documents.Interfaces
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
}
