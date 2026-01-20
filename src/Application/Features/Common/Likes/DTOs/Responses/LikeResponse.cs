using Domain.Enums.Common;

namespace Application.Features.Common.Likes.DTOs.Responses;

public class LikeResponse
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? UserName { get; set; }
    public string? ContentTitle { get; set; }
}