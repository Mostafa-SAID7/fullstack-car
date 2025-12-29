using Domain.Enums.Community.Reviews;

namespace Application.Features.Community.Reviews.DTOs
{
    public class CreateReviewRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public ReviewType Type { get; set; }
        public string? ImageUrl { get; set; }
        public string? CarBrand { get; set; }
        public string? CarModel { get; set; }
        public int? CarYear { get; set; }
    }

    public class UpdateReviewRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class FlagReviewRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string? AdditionalComments { get; set; }
    }
}
