namespace Application.Features.Community.Feed.DTOs;

public class HideFeedItemRequest
{
    public string Reason { get; set; } = string.Empty; // not_interested, spam, inappropriate, etc.
    public string? AdditionalInfo { get; set; }
}

public class ReportFeedItemRequest
{
    public string Reason { get; set; } = string.Empty; // spam, harassment, inappropriate_content, etc.
    public string? Description { get; set; }
    public string? Category { get; set; }
}