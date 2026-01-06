using Application.Common.Models;
using Application.Features.Admin.Management.Users.Users.DTOs.Responses;
using Application.Features.Admin.Management.Users.Users.Models;
using MediatR;

namespace Application.Features.Admin.Management.Users.Users.Queries
{
    public class GetUsersQuery : IRequest<Result<UserListResponse>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Status { get; set; }
        public string? Search { get; set; }
        public string? Role { get; set; }
        public DateTime? JoinedAfter { get; set; }
        public DateTime? JoinedBefore { get; set; }
        public bool? IsVerified { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public string? SortDirection { get; set; } = "desc";
    }

    public class GetUserByIdQuery : IRequest<Result<UserDetailResponse>>
    {
        public Guid UserId { get; set; }
    }

    public class SearchUsersQuery : IRequest<Result<List<UserSummary>>>
    {
        public string SearchTerm { get; set; } = string.Empty;
        public int Limit { get; set; } = 20;
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}
