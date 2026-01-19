namespace Application.Features.Community.Posts.DTOs;

public class ModeratePostRequest
{
    public string Action { get; set; } = string.Empty; // "Approve", "Reject", "Delete", "Hide"
    public string? Reason { get; set; }
}
