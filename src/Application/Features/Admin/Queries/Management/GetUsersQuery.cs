using Application.Common.Models;
using Application.Features.Admin.DTOs.Management;
using MediatR;

namespace Application.Features.Admin.Queries.Management
{
    public class GetUsersQuery : IRequest<Result<PaginatedList<AdminUserDto>>>
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

    public class GetUserByIdQuery : IRequest<Result<AdminUserDto>>
    {
        public Guid UserId { get; set; }
    }

    public class GetUserStatisticsQuery : IRequest<Result<UserStatisticsDto>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserActivityQuery : IRequest<Result<PaginatedList<UserActivityDto>>>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? ActivityType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserReportsQuery : IRequest<Result<PaginatedList<UserReportDto>>>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public bool? IsResolved { get; set; }
        public string? Category { get; set; }
    }

    public class SearchUsersQuery : IRequest<Result<List<AdminUserDto>>>
    {
        public string SearchTerm { get; set; } = string.Empty;
        public int Limit { get; set; } = 20;
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}