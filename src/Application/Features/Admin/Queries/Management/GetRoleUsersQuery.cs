using Application.Common.Models;
using Application.Features.Admin.DTOs.Management;
using MediatR;

namespace Application.Features.Admin.Queries.Management
{
    public class GetRoleUsersQuery : IRequest<Result<PaginatedList<AdminUserDto>>>
    {
        public Guid RoleId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
    }
}