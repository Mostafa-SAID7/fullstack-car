using MediatR;

namespace Application.Features.Shared.Localization.Commands
{
    public class ExportTranslationsCommand : IRequest<ExportResultDto>
    {
        public string? Language { get; set; }
        public List<string>? Categories { get; set; }
        public string Format { get; set; } = "json"; // json, csv, xlsx
        public bool IncludeInactive { get; set; } = false;
    }

    public class ExportResultDto
    {
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string ContentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public int TotalRecords { get; set; }
    }
}
