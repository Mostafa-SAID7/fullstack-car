namespace Application.Features.Shared.Files.DTOs;

public class ImageProcessingRequest
{
    public string Operation { get; set; } = string.Empty;
    public Dictionary<string, object> Parameters { get; set; } = new();
    public string? OutputFormat { get; set; }
    public int? Quality { get; set; }
}