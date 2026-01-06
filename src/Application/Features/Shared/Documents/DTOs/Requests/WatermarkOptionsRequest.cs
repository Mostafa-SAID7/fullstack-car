namespace Application.Features.Shared.Documents.DTOs.Requests
{
    public class WatermarkOptionsRequest
    {
        public string? Position { get; set; }
        public float? Opacity { get; set; }
        public int? FontSize { get; set; }
        public string? FontColor { get; set; }
        public float? Rotation { get; set; }
    }
}
