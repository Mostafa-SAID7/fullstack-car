using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Management.Commands
{
    public class CreateRoleCommand : IRequest<Result<Guid>>
    {
        public Guid AdminId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Permissions { get; set; } = new();
    }

    public class UpdateRoleCommand : IRequest<Result<bool>>
    {
        public Guid RoleId { get; set; }
        public Guid AdminId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Permissions { get; set; } = new();
    }

    public class DeleteRoleCommand : IRequest<Result<bool>>
    {
        public Guid RoleId { get; set; }
        public Guid AdminId { get; set; }
    }

    public class AssignUserToRoleCommand : IRequest<Result<bool>>
    {
        public Guid RoleId { get; set; }
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
    }

    public class RemoveUserFromRoleCommand : IRequest<Result<bool>>
    {
        public Guid RoleId { get; set; }
        public Guid UserId { get; set; }
        public Guid AdminId { get; set; }
    }
}