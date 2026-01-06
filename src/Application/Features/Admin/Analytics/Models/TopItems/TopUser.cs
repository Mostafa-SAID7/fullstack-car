namespace Application.Features.Admin.Analytics.Models.TopItems
{
    public class TopUser
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int PostCount { get; set; }
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public double EngagementScore { get; set; }
    }
}
