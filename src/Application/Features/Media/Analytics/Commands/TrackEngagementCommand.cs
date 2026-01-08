using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Analytics.Commands;

public class TrackEngagementCommand : IRequest<Result<EngagementDto>>
{
    public Guid MediaId { get; set; }
    public MediaType MediaType { get; set; }
    public Guid UserId { get; set; }
    public EngagementType EngagementType { get; set; }
    public string? Content { get; set; } // For comments
    public Guid? ParentCommentId { get; set; } // For comment replies
    public string? SharePlatform { get; set; } // For shares
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}

public enum EngagementType
{
    Like,
    Dislike,
    Comment,
    Share,
    Subscribe,
    Bookmark,
    Report
}