using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Queries;

public class GetSiteSettingsQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetPublicSiteSettingsQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetSystemHealthQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetSettingsBackupsQuery : IRequest<ApiResponseDto<object>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetSettingsAuditLogQuery : IRequest<ApiResponseDto<object>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SettingCategory { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

// Handlers
public class GetSiteSettingsQueryHandler : IRequestHandler<GetSiteSettingsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSiteSettingsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var settings = new
        {
            General = new { SiteName = "Community Car", SiteDescription = "Car community platform" },
            Email = new { SmtpServer = "smtp.example.com", SmtpPort = 587 },
            Seo = new { MetaTitle = "Community Car", MetaDescription = "Best car community" },
            SocialMedia = new { Facebook = "facebook.com/communitycar", Twitter = "@communitycar" },
            Maintenance = new { IsMaintenanceMode = false, MaintenanceMessage = "" }
        };
        
        return ApiResponseDto<object>.Success(settings);
    }
}

public class GetPublicSiteSettingsQueryHandler : IRequestHandler<GetPublicSiteSettingsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetPublicSiteSettingsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var settings = new
        {
            SiteName = "Community Car",
            SiteDescription = "Car community platform",
            SocialMedia = new { Facebook = "facebook.com/communitycar", Twitter = "@communitycar" }
        };
        
        return ApiResponseDto<object>.Success(settings);
    }
}

public class GetSystemHealthQueryHandler : IRequestHandler<GetSystemHealthQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSystemHealthQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var health = new
        {
            Status = "Healthy",
            Uptime = TimeSpan.FromHours(24).ToString(),
            Services = new[]
            {
                new { Name = "Database", Status = "Healthy", ResponseTime = "5ms" },
                new { Name = "Cache", Status = "Healthy", ResponseTime = "2ms" },
                new { Name = "Storage", Status = "Healthy", ResponseTime = "10ms" }
            }
        };
        
        return ApiResponseDto<object>.Success(health);
    }
}

public class GetSettingsBackupsQueryHandler : IRequestHandler<GetSettingsBackupsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSettingsBackupsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var backups = new
        {
            Items = new[]
            {
                new { Id = Guid.NewGuid(), Name = "Backup_2024_01_15", CreatedAt = DateTime.UtcNow.AddDays(-1), Size = "2.5MB" },
                new { Id = Guid.NewGuid(), Name = "Backup_2024_01_10", CreatedAt = DateTime.UtcNow.AddDays(-6), Size = "2.3MB" }
            },
            TotalCount = 2,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
        
        return ApiResponseDto<object>.Success(backups);
    }
}

public class GetSettingsAuditLogQueryHandler : IRequestHandler<GetSettingsAuditLogQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSettingsAuditLogQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var auditLog = new
        {
            Items = new[]
            {
                new { Id = Guid.NewGuid(), Category = "General", Action = "Updated", ChangedBy = "Admin", ChangedAt = DateTime.UtcNow.AddHours(-1) },
                new { Id = Guid.NewGuid(), Category = "Email", Action = "Updated", ChangedBy = "Admin", ChangedAt = DateTime.UtcNow.AddHours(-2) }
            },
            TotalCount = 2,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
        
        return ApiResponseDto<object>.Success(auditLog);
    }
}