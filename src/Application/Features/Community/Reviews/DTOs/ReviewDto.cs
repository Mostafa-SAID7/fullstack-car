using Domain.Enums.Community.Reviews;

namespace Application.Features.Community.Reviews.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public ReviewType Type { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public int HelpfulCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string? UserProfileImageUrl { get; set; }

        public string? CarBrand { get; set; }
        public string? CarModel { get; set; }
        public int? CarYear { get; set; }
    }
}
    public class ReviewStatsDto
    {
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        public int TotalUsers { get; set; }
        public int ReviewsThisMonth { get; set; }
    }