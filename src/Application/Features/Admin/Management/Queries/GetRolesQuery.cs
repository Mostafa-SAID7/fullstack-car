using Application.Common.Models;
using Application.Features.Admin.Management.DTOs.Responses;
using MediatR;

namespace Application.Features.Admin.Management.Queries
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

    public class GetRoleUsersQuery : IRequest<Result<PaginatedList<AdminUserResponse>>>
    {
        public Guid RoleId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class GetAvailablePermissionsQuery : IRequest<Result<List<PermissionResponse>>>
    {
        public string? Category { get; set; }
    }
}