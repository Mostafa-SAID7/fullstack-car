using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Commands;

public class InviteMemberCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid InvitedBy { get; set; }
    public InviteMemberRequest Request { get; set; } = new();
}

public class UpdateMemberRoleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid MemberId { get; set; }
    public Guid UpdatedBy { get; set; }
    public UpdateMemberRoleRequest Request { get; set; } = new();
}

public class PromoteMemberCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid MemberId { get; set; }
    public Guid PromotedBy { get; set; }
    public PromoteMemberRequest Request { get; set; } = new();
}

public class DemoteMemberCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid MemberId { get; set; }
    public Guid DemotedBy { get; set; }
    public DemoteMemberRequest Request { get; set; } = new();
}

public class RemoveMemberCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid MemberId { get; set; }
    public Guid RemovedBy { get; set; }
    public RemoveMemberRequest Request { get; set; } = new();
}

public class BanMemberCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid MemberId { get; set; }
    public Guid BannedBy { get; set; }
    public BanMemberRequest Request { get; set; } = new();
}

public class UnbanMemberCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid MemberId { get; set; }
    public Guid UnbannedBy { get; set; }
}
