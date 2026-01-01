namespace Application.Features.Community.Guides.DTOs.Requests;

public class RateGuideRequest
{
    public Guid GuideId { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string? Comment { get; set; }
    public bool IsHelpful { get; set; }
}