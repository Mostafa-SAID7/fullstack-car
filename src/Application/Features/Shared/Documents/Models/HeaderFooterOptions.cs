namespace Application.Features.Shared.Documents.Models
{
    public class HeaderFooterOptions
    {
        public string? Html { get; set; }
        public string? Height { get; set; }
        public bool ShowPageNumbers { get; set; } = false;
        public string? DateFormat { get; set; }
    }
}
