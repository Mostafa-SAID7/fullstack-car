using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetSecurityEventsQuery : IRequest<Result<PaginatedList<SecurityEventDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Severity { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? EventType { get; set; }
        public Guid? UserId { get; set; }
    }

    public class SecurityEventDto
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public Dictionary<string, object> Details { get; set; } = new();
        public bool IsResolved { get; set; }
        public Guid? ResolvedBy { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }
}