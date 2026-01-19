namespace Application.Features.Community.Posts.DTOs;

public class PostAnalyticsDto
{
    public Guid PostId { get; set; }
    public int TotalViews { get; set; }
    public int TotalLikes { get; set; }
    public int TotalComments { get; set; }
    public int UniqueViewers { get; set; }
    public double EngagementRate { get; set; }
    public Dictionary<string, int> ViewsByDate { get; set; } = new();
    public Dictionary<string, int> LikesByDate { get; set; } = new();
}
