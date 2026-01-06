using Application.Features.Shared.Documents.Models;

namespace Application.Features.Shared.Documents.DTOs.Requests
{
    public class PdfReportRequest
    {
        public IEnumerable<object>? Data { get; set; }
        public ReportOptions? Options { get; set; }
        public string? FileName { get; set; }
    }
}
