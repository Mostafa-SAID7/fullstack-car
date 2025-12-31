using Application.Common.Models;
using Application.Features.Admin.Management.DTOs.Responses;
using MediatR;

namespace Application.Features.Admin.Management.Queries
{
    public class GetUsersQuery : IRequest<Result<PaginatedList<AdminUserResponse>>>
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

    public class GetUserByIdQuery : IRequest<Result<AdminUserResponse>>
    {
        public Guid UserId { get; set; }
    }

    public class GetUserStatisticsQuery : IRequest<Result<UserStatisticsResponse>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserActivityQuery : IRequest<Result<PaginatedList<UserActivityResponse>>>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? ActivityType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserReportsQuery : IRequest<Result<PaginatedList<UserReportResponse>>>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public bool? IsResolved { get; set; }
        public string? Category { get; set; }
    }

    public class SearchUsersQuery : IRequest<Result<List<AdminUserResponse>>>
    {
        public string SearchTerm { get; set; } = string.Empty;
        public int Limit { get; set; } = 20;
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}