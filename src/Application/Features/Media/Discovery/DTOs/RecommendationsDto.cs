using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Discovery.DTOs;

public class RecommendationsDto
{
    public List<VideoListDto> RecommendedVideos { get; set; } = new();
    public List<PodcastListDto> RecommendedPodcasts { get; set; } = new();
    public List<VideoListDto> BasedOnWatchHistory { get; set; } = new();
    public List<VideoListDto> BasedOnLikes { get; set; } = new();
    public List<MediaSearchResultDto> FromFollowedCreators { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public bool IsPersonalized { get; set; }
}