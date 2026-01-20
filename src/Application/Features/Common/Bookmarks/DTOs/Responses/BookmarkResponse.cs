using Domain.Enums.Common;

namespace Application.Features.Common.Bookmarks.DTOs.Responses;

public class BookmarkResponse
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid UserId { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Additional properties for UI display
    public string ContentTitle { get; set; } = string.Empty;
    public string ContentUrl { get; set; } = string.Empty;
    public string ContentThumbnail { get; set; } = string.Empty;
    public string ContentAuthor { get; set; } = string.Empty;
}