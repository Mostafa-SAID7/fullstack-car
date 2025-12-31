using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetBackupStorageUsageQuery : IRequest<Result<BackupStorageUsageDto>>
    {
    }

    public class BackupStorageUsageDto
    {
        public long TotalStorageUsed { get; set; }
        public long AvailableStorage { get; set; }
        public double UsagePercentage { get; set; }
        public int TotalBackups { get; set; }
        public Dictionary<string, long> StorageByType { get; set; } = new();
        public Dictionary<string, int> BackupsByStatus { get; set; } = new();
        public List<BackupSizeDto> LargestBackups { get; set; } = new();
        public List<BackupAgeDto> OldestBackups { get; set; } = new();
    }

    public class BackupSizeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public long Size { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class BackupAgeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int DaysOld { get; set; }
    }
}