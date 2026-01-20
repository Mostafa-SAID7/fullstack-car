using Application.Common.Models;
using Application.Features.Admin.System.DTOs;
using Application.Features.Admin.Management.Users.Activities.Models;
using MediatR;

namespace Application.Features.Admin.System.Queries
{
    public class GetSystemHealthQuery : IRequest<Result<SystemHealthDto>>
    {
    }

    public class GetSystemConfigurationQuery : IRequest<Result<SystemConfigurationDto>>
    {
    }

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

    public class GetAuditLogByIdQuery : IRequest<Result<AuditLogDto>>
    {
        public Guid Id { get; set; }
        public Guid AuditLogId { get; set; }
    }

    public class GetBackupsQuery : IRequest<Result<PaginatedList<BackupInfoDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Type { get; set; }
        public string? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetBackupByIdQuery : IRequest<Result<BackupInfoDto>>
    {
        public Guid Id { get; set; }
        public Guid BackupId { get; set; }
    }

    public class GetSystemAlertsQuery : IRequest<Result<PaginatedList<SystemAlertDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Severity { get; set; }
        public string? Category { get; set; }
        public bool? IsAcknowledged { get; set; }
        public bool? Acknowledged { get; set; }
    }

    public class GetFeatureFlagsQuery : IRequest<Result<List<FeatureFlagDto>>>
    {
        public string? Environment { get; set; }
    }

    public class GetServicesStatusQuery : IRequest<Result<List<ServiceStatusDto>>>
    {
    }

    public class GetBackupSchedulesQuery : IRequest<Result<List<BackupScheduleDto>>>
    {
    }

    public class GetBackupStorageUsageQuery : IRequest<Result<BackupStorageUsageDto>>
    {
    }

    public class GetAuditStatsQuery : IRequest<Result<AuditStatsDto>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class GetUserActivityQuery : IRequest<Result<PaginatedList<Application.Features.Admin.Management.Users.Activities.Models.UserActivity>>>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetSecurityEventsQuery : IRequest<Result<PaginatedList<SecurityEventDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Severity { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
