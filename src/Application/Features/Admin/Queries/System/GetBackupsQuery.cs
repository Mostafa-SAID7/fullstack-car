using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetBackupsQuery : IRequest<Result<PaginatedList<BackupInfoDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Type { get; set; }
        public string? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}