using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Discovery.DTOs;

public class FeaturedContentDto
{
    public MediaSearchResultDto? HeroContent { get; set; }
    public List<VideoListDto> FeaturedVideos { get; set; } = new();
    public List<PodcastListDto> FeaturedPodcasts { get; set; } = new();
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}