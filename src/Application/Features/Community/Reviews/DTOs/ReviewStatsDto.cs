namespace Application.Features.Community.Reviews.DTOs;

public class ReviewStatsDto
{
    public int TotalReviews { get; set; }
    public double AverageRating { get; set; }
    public int TotalUsers { get; set; }
    public int ReviewsThisMonth { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = new();
}
