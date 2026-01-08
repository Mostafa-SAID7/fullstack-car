namespace Application.Features.Media.Discovery.DTOs;

public class CategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int VideoCount { get; set; }
    public int PodcastCount { get; set; }
    public int TotalCount => VideoCount + PodcastCount;
    public bool IsActive { get; set; } = true;
}