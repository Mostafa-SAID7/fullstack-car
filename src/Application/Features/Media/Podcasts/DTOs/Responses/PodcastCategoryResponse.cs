namespace Application.Features.Media.Podcasts.DTOs.Responses;

public class PodcastCategoryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public int PodcastCount { get; set; }
    public int SubscriberCount { get; set; }
}