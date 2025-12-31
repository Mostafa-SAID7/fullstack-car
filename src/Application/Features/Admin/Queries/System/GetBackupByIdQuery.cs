using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetBackupByIdQuery : IRequest<Result<BackupInfoDto>>
    {
        public Guid BackupId { get; set; }
    }
}