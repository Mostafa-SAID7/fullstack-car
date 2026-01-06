using Application.Common.Models;
using Application.Features.Admin.Management.Users.Roles.DTOs.Responses;
using Application.Features.Admin.Management.Users.Users.Models;
using Application.Features.Admin.Management.Users.Permissions.DTOs.Responses;
using MediatR;

namespace Application.Features.Admin.Management.Users.Roles.Queries
{
    public class GetRolesQuery : IRequest<Result<PaginatedList<RoleResponse>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public bool? IsSystemRole { get; set; }
    }

    public class GetRoleByIdQuery : IRequest<Result<RoleResponse>>
    {
        public Guid RoleId { get; set; }
    }

    public class GetRoleUsersQuery : IRequest<Result<PaginatedList<AdminUser>>>
    {
        public Guid RoleId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
