using Application.Common.Models;
using Application.Features.Admin.Management.Users.Users.DTOs.Responses;
using MediatR;

namespace Application.Features.Admin.Management.Users.Reports.Commands
{
    public class ResolveUserReportCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid ReportId { get; set; }
        public Guid AdminId { get; set; }
        public string Resolution { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string ActionTaken { get; set; } = string.Empty;
    }

    public class DismissUserReportCommand : IRequest<Result<UserActionResponse>>
    {
        public Guid ReportId { get; set; }
        public Guid AdminId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}