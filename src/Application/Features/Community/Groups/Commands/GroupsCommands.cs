using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Commands;

public class ModerateGroupCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid ModeratorId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Reason { get; set; }
}

public class UnfeatureGroupCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
}

public class BulkInviteMembersCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid InvitedBy { get; set; }
    public BulkInviteMembersRequest Request { get; set; } = new();
}

public class ApproveJoinRequestCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid RequestId { get; set; }
    public Guid ApprovedBy { get; set; }
    public string? WelcomeMessage { get; set; }
}

public class RejectJoinRequestCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid RequestId { get; set; }
    public Guid RejectedBy { get; set; }
    public RejectJoinRequestRequest Request { get; set; } = new();
}

public class TransferGroupOwnershipCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid CurrentOwnerId { get; set; }
    public TransferOwnershipRequest Request { get; set; } = new();
}
