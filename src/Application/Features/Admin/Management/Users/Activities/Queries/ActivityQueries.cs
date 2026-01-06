using Application.Common.Models;
using Application.Features.Admin.Management.Users.Activities.Models;
using MediatR;

namespace Application.Features.Admin.Management.Users.Activities.Queries
{
    public class GetUserActivityQuery : IRequest<Result<List<UserActivity>>>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? ActivityType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserActivitySummaryQuery : IRequest<Result<UserActivitySummary>>
    {
        public Guid UserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class GetUserActivityTimelineQuery : IRequest<Result<List<UserActivityTimelineItem>>>
    {
        public Guid UserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Limit { get; set; }
    }

    public class GetUserActivityStatsQuery : IRequest<Result<UserActivityStats>>
    {
        public Guid UserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}
