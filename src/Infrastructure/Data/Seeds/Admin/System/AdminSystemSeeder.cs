using Domain.Entities.Admin.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.System;

public class AdminSystemSeeder
{
    private readonly ILogger<AdminSystemSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public AdminSystemSeeder(ILogger<AdminSystemSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Admin System data...");

            await SeedSystemConfigurationsAsync();
            await SeedAuditLogsAsync();

            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin System data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Admin System data.");
            throw;
        }
    }

    private async Task SeedSystemConfigurationsAsync()
    {
        if (await _context.SystemConfigurations.AnyAsync())
        {
            _logger.LogInformation("System configurations already exist. Skipping seeding.");
            return;
        }

        var configurations = new List<SystemConfiguration>
        {
            new()
            {
                Key = "MaxFileUploadSize",
                Value = "10485760", // 10MB
                DataType = "int",
                Category = "FileUpload",
                Description = "Maximum file upload size in bytes",
                IsActive = true
            },
            new()
            {
                Key = "SessionTimeout",
                Value = "30",
                DataType = "int",
                Category = "Security",
                Description = "Session timeout in minutes",
                IsActive = true
            },
            new()
            {
                Key = "EnableEmailNotifications",
                Value = "true",
                DataType = "bool",
                Category = "Notifications",
                Description = "Enable email notifications system-wide",
                IsActive = true
            },
            new()
            {
                Key = "MaintenanceMode",
                Value = "false",
                DataType = "bool",
                Category = "System",
                Description = "Enable maintenance mode",
                IsActive = true
            },
            new()
            {
                Key = "DefaultLanguage",
                Value = "en-US",
                DataType = "string",
                Category = "Localization",
                Description = "Default system language",
                IsActive = true
            }
        };

        await _context.SystemConfigurations.AddRangeAsync(configurations);
        _logger.LogInformation($"Added {configurations.Count} system configurations.");
    }

    private async Task SeedAuditLogsAsync()
    {
        if (await _context.AuditLogs.AnyAsync())
        {
            _logger.LogInformation("Audit logs already exist. Skipping seeding.");
            return;
        }

        var auditLogs = new List<AuditLog>
        {
            new()
            {
                EntityName = "SystemConfiguration",
                Action = Domain.Enums.Admin.System.AuditActionType.Create,
                EntityId = "1",
                Changes = "Initial system configuration created",
                Timestamp = DateTime.UtcNow.AddDays(-30),
                UserId = null,
                UserName = "System",
                IpAddress = "127.0.0.1"
            },
            new()
            {
                EntityName = "ApplicationUser",
                Action = Domain.Enums.Admin.System.AuditActionType.Create,
                EntityId = "1",
                Changes = "Admin user created",
                Timestamp = DateTime.UtcNow.AddDays(-29),
                UserId = null,
                UserName = "System",
                IpAddress = "127.0.0.1"
            }
        };

        await _context.AuditLogs.AddRangeAsync(auditLogs);
        _logger.LogInformation($"Added {auditLogs.Count} audit log entries.");
    }
}