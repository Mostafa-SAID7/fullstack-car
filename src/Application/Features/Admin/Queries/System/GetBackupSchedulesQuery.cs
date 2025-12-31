using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetBackupSchedulesQuery : IRequest<Result<List<BackupScheduleDto>>>
    {
        public bool? IsActive { get; set; }
    }

    public class BackupScheduleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Schedule { get; set; } = string.Empty; // Cron expression
        public int RetentionDays { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastRun { get; set; }
        public DateTime? NextRun { get; set; }
        public string? LastStatus { get; set; }
        public Guid CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
    }
}