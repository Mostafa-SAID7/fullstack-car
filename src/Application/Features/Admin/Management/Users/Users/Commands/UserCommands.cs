using Application.Common.Models;
using Application.Features.Admin.Management.Users.Users.DTOs.Requests;
using Application.Features.Admin.Management.Users.Users.DTOs.Responses;
using MediatR;

namespace Application.Features.Admin.Management.Users.Users.Commands
{
    public class SuspendUserCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public SuspendUserRequest Request { get; set; } = new();
    }

    public class BanUserCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public BanUserRequest Request { get; set; } = new();
    }

    public class DeleteUserCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public DeleteUserRequest Request { get; set; } = new();
    }

    public class SendMessageToUserCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public SendMessageRequest Request { get; set; } = new();
    }

    public class UpdateUserRolesCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public UpdateUserRolesRequest Request { get; set; } = new();
    }

    public class ImpersonateUserCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public ImpersonateUserRequest Request { get; set; } = new();
    }
}
