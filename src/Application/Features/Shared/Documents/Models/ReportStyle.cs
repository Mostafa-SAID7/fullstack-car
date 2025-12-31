namespace Application.Features.Shared.Documents.Models
{
    public class ReportStyle
    {
        public string FontFamily { get; set; } = "Arial";
        public int FontSize { get; set; } = 10;
        public string HeaderBackgroundColor { get; set; } = "#f0f0f0";
        public string AlternateRowColor { get; set; } = "#f9f9f9";
        public string BorderColor { get; set; } = "#cccccc";
    }
}