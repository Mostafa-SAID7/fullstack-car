using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class ModerateEventCommentsCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid ModeratedBy { get; set; }
    public string Action { get; set; } = string.Empty;
    public List<Guid> CommentIds { get; set; } = new();
    public string? Reason { get; set; }
}