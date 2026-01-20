using Domain.Enums.Common;

namespace Application.Features.Common.Views.DTOs.Responses;

public class ViewResponse
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid? UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Additional properties for analytics
    public string ContentTitle { get; set; } = string.Empty;
    public string ContentUrl { get; set; } = string.Empty;
    public string? UserName { get; set; }
}