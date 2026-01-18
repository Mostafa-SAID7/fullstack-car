namespace Application.Features.Community.Guides.DTOs;

public class BookmarkGuideRequest
{
    public Guid GuideId { get; set; }
    public bool IsBookmarked { get; set; }
}