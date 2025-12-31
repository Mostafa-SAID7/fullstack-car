namespace Application.Features.Shared.Documents.Models
{
    public class ReportColumn
    {
        public string PropertyName { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public int Width { get; set; } = 100;
        public string Alignment { get; set; } = "Left";
    }
}