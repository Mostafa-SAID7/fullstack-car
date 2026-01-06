using Application.Common.Models;
using Application.Features.Admin.Management.Users.Statistics.Models;
using MediatR;

namespace Application.Features.Admin.Management.Users.Statistics.Queries
{
    public class GetUserStatisticsQuery : IRequest<Result<UserStatistics>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetUserOverviewStatisticsQuery : IRequest<Result<UserOverviewStatistics>>
    {
    }

    public class GetUserGrowthStatisticsQuery : IRequest<Result<UserGrowthStatistics>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Period { get; set; } = "daily";
    }

    public class GetUserEngagementStatisticsQuery : IRequest<Result<UserEngagementStatistics>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class GetUserDemographicsQuery : IRequest<Result<UserDemographics>>
    {
    }

    public class GetUserRetentionStatisticsQuery : IRequest<Result<UserRetentionStatistics>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class ExportUserStatisticsQuery : IRequest<Result<ExportResult>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Format { get; set; } = "csv";
    }
}
