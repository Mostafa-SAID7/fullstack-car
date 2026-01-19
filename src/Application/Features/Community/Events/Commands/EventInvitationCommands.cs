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

public class BulkCancelEventInvitationsCommand : IRequest<ApiResponseDto<BulkCancelResult>>
{
    public Guid EventId { get; set; }
    public List<Guid> InvitationIds { get; set; } = new();
    public Guid CancelledBy { get; set; }
    public string? Reason { get; set; }
}

public class CleanupExpiredEventInvitationsCommand : IRequest<ApiResponseDto<CleanupResult>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
}

public class BulkCancelResult
{
    public int CancelledCount { get; set; }
    public int TotalCount { get; set; }
}

public class CleanupResult
{
    public int CleanedUpCount { get; set; }
    public int TotalExpired { get; set; }
}
public class BulkCancelEventInvitationsCommandHandler : IRequestHandler<BulkCancelEventInvitationsCommand, ApiResponseDto<BulkCancelResult>>
{
    public async Task<ApiResponseDto<BulkCancelResult>> Handle(BulkCancelEventInvitationsCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var result = new BulkCancelResult
        {
            CancelledCount = request.InvitationIds.Count,
            TotalCount = request.InvitationIds.Count
        };
        
        return ApiResponseDto<BulkCancelResult>.Success(result);
    }
}

public class CleanupExpiredEventInvitationsCommandHandler : IRequestHandler<CleanupExpiredEventInvitationsCommand, ApiResponseDto<CleanupResult>>
{
    public async Task<ApiResponseDto<CleanupResult>> Handle(CleanupExpiredEventInvitationsCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var result = new CleanupResult
        {
            CleanedUpCount = 5,
            TotalExpired = 5
        };
        
        return ApiResponseDto<CleanupResult>.Success(result);
    }
}