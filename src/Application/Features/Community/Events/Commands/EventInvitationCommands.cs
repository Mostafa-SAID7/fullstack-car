using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class DeclineEventInvitationCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid InvitationId { get; set; }
}

public class CancelEventInvitationCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid InvitationId { get; set; }
    public Guid CancelledBy { get; set; }
}

public class ResendEventInvitationCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid InvitationId { get; set; }
    public Guid ResentBy { get; set; }
}

public class BulkCancelEventInvitationsCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public List<Guid> InvitationIds { get; set; } = new();
    public Guid CancelledBy { get; set; }
    public string? Reason { get; set; }
}

public class CleanupExpiredEventInvitationsCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
}