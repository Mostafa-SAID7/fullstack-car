namespace Application.Features.Shared.Documents.Models
{
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
}
