using Application.Common.Models;
using Application.Features.Admin.DTOs.Management;
using MediatR;

namespace Application.Features.Admin.Commands.Management
{
    public class SuspendUserCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public SuspendUserRequest Request { get; set; } = new();
    }

    public class BanUserCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public BanUserRequest Request { get; set; } = new();
    }

    public class DeleteUserCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public DeleteUserRequest Request { get; set; } = new();
    }

    public class SendMessageToUserCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public SendMessageRequest Request { get; set; } = new();
    }

    public class UpdateUserRolesCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public UpdateUserRolesRequest Request { get; set; } = new();
    }

    public class ImpersonateUserCommand : IRequest<Result<string>>
    {
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
        public ImpersonateUserRequest Request { get; set; } = new();
    }
}