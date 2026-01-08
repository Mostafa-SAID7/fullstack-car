using Application.Features.Media.Analytics.Commands;
using Domain.Enums.Media;

namespace Application.Features.Media.Analytics.DTOs;

public class EngagementDto
{
    public Guid Id { get; set; }
    public Guid MediaId { get; set; }
    public MediaType MediaType { get; set; }
    public Guid UserId { get; set; }
    public EngagementType EngagementType { get; set; }
    public string? Content { get; set; }
    public Guid? ParentCommentId { get; set; }
    public string? SharePlatform { get; set; }
    public DateTime CreatedAt { get; set; }
}