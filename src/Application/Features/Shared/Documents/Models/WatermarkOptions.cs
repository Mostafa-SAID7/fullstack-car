namespace Application.Features.Shared.Documents.Models
{
    public class WatermarkOptions
    {
        public string Position { get; set; } = "Center";
        public float Opacity { get; set; } = 0.3f;
        public int FontSize { get; set; } = 48;
        public string FontColor { get; set; } = "#cccccc";
        public float Rotation { get; set; } = 45f;
    }
}
