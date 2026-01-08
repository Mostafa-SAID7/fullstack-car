using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Discovery.DTOs;

public class TrendingContentDto
{
    public List<VideoListDto> TrendingVideos { get; set; } = new();
    public List<PodcastListDto> TrendingPodcasts { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public int TimeWindowDays { get; set; }
    public string Algorithm { get; set; } = string.Empty;
}