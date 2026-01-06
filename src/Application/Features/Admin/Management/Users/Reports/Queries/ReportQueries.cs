using Application.Common.Models;
using Application.Features.Admin.Management.Users.Reports.Models;
using MediatR;

namespace Application.Features.Admin.Management.Users.Reports.Queries
{
    public class GetUserReportsQuery : IRequest<Result<List<UserReport>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public Guid? ReportedUserId { get; set; }
        public Guid? ReporterId { get; set; }
        public string? Category { get; set; }
        public bool? IsResolved { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserReportByIdQuery : IRequest<Result<UserReportDetail>>
    {
        public Guid ReportId { get; set; }
    }

    public class GetUserReportStatisticsQuery : IRequest<Result<UserReportStatistics>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}