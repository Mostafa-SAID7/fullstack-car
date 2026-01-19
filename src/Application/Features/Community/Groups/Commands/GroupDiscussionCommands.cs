using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Commands;

public class CreateGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid CreatedBy { get; set; }
    public CreateGroupDiscussionRequest Request { get; set; } = new();
}

public class UpdateGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public Guid UpdatedBy { get; set; }
    public UpdateGroupDiscussionRequest Request { get; set; } = new();
}

public class DeleteGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public Guid DeletedBy { get; set; }
}

public class PinGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public Guid PinnedBy { get; set; }
}

public class UnpinGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
}

public class LockGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public Guid LockedBy { get; set; }
    public LockDiscussionRequest Request { get; set; } = new();
}

public class UnlockGroupDiscussionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
}

public class CreateDiscussionReplyCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public Guid CreatedBy { get; set; }
    public CreateDiscussionReplyRequest Request { get; set; } = new();
}
