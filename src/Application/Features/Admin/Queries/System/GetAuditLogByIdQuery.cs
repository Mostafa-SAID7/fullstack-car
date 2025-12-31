using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetAuditLogByIdQuery : IRequest<Result<AuditLogDto>>
    {
        public Guid AuditLogId { get; set; }
    }
}