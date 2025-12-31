using Application.Common.Models;
using Application.Features.Admin.DTOs.Moderation;
using MediatR;

namespace Application.Features.Admin.Commands.Moderation
{
    public class ApproveContentCommand : IRequest<Result<bool>>
    {
        public Guid ContentId { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public Guid ModeratorId { get; set; }
        public ApproveContentRequest Request { get; set; } = new();
    }

    public class RejectContentCommand : IRequest<Result<bool>>
    {
        public Guid ContentId { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public Guid ModeratorId { get; set; }
        public RejectContentRequest Request { get; set; } = new();
    }

    public class ResolveReportCommand : IRequest<Result<bool>>
    {
        public Guid ReportId { get; set; }
        public Guid ModeratorId { get; set; }
        public ResolveReportRequest Request { get; set; } = new();
    }

    public class BulkModerationCommand : IRequest<Result<BulkModerationResult>>
    {
        public Guid ModeratorId { get; set; }
        public BulkModerationRequest Request { get; set; } = new();
    }

    public class CreateAutoModerationRuleCommand : IRequest<Result<Guid>>
    {
        public Guid AdminId { get; set; }
        public AutoModerationRuleDto Rule { get; set; } = new();
    }

    public class UpdateAutoModerationRuleCommand : IRequest<Result<bool>>
    {
        public Guid RuleId { get; set; }
        public Guid AdminId { get; set; }
        public AutoModerationRuleDto Rule { get; set; } = new();
    }

    public class DeleteAutoModerationRuleCommand : IRequest<Result<bool>>
    {
        public Guid RuleId { get; set; }
        public Guid AdminId { get; set; }
    }

    public class BulkModerationResult
    {
        public int TotalProcessed { get; set; }
        public int Successful { get; set; }
        public int Failed { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, int> ActionCounts { get; set; } = new();
    }
}