using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Commands.System
{
    public class ExportAuditLogsCommand : IRequest<Result<Guid>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Format { get; set; } = "CSV";
        public Dictionary<string, object> IncludeFilters { get; set; } = new();
    }
}