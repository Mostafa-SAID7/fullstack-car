namespace Application.Features.Shared.Documents.DTOs.Requests
{
    public class PdfFromTemplateRequest
    {
        public string? TemplateName { get; set; }
        public object? Model { get; set; }
        public string? FileName { get; set; }
        public string? PageSize { get; set; }
        public string? Orientation { get; set; }
    }
}
