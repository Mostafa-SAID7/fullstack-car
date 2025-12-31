using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetAuditLogsQuery : IRequest<Result<PaginatedList<AuditLogDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Action { get; set; }
        public string? EntityType { get; set; }
        public Guid? UserId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? IpAddress { get; set; }
    }
}