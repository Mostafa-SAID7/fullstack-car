namespace Application.Features.Marketplace.Services.DTOs;

public class UpdateCarServiceRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationMinutes { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsActive { get; set; } = true;
}