namespace Application.Features.Media.Podcasts.DTOs.Responses;

public class PodcastDashboardResponse
{
    public PodcastDashboardStats Stats { get; set; } = new();
    public List<PodcastResponse> RecentPodcasts { get; set; } = new();
    public List<PodcastResponse> TrendingPodcasts { get; set; } = new();
    public List<PodcastResponse> RecommendedPodcasts { get; set; } = new();
    public List<PodcastResponse> NewEpisodes { get; set; } = new();
    public List<PodcastCategoryResponse> PopularCategories { get; set; } = new();
}

public class PodcastDashboardStats
{
    public int TotalPodcasts { get; set; }
    public int TotalListens { get; set; }
    public int TotalSubscribers { get; set; }
    public int MonthlyListens { get; set; }
    public TimeSpan TotalListenTime { get; set; }
    public int NewEpisodesCount { get; set; }
}