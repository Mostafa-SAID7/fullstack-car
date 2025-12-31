using Application.Common.Models;
using Application.Features.Admin.DTOs.Moderation;
using MediatR;

namespace Application.Features.Admin.Queries.Moderation
{
    public class GetContentReportsQuery : IRequest<Result<PaginatedList<ContentReportDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? ContentType { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public Guid? ReporterId { get; set; }
    }
}