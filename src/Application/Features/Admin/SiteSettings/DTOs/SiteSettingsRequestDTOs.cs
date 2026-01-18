namespace Application.Features.Admin.SiteSettings.DTOs;

public class UpdateDatabaseConfigurationRequest
{
    public string? ConnectionString { get; set; }
    public int CommandTimeout { get; set; } = 30;
    public int MaxPoolSize { get; set; } = 100;
    public bool EnableRetryOnFailure { get; set; } = true;
    public int MaxRetryCount { get; set; } = 3;
}

public class UpdateCacheConfigurationRequest
{
    public string? RedisConnectionString { get; set; }
    public int DefaultExpirationMinutes { get; set; } = 60;
    public bool EnableDistributedCache { get; set; } = true;
    public int MaxCacheSize { get; set; } = 1000;
}

public class UpdateLoggingConfigurationRequest
{
    public string LogLevel { get; set; } = "Information";
    public bool EnableFileLogging { get; set; } = true;
    public bool EnableDatabaseLogging { get; set; } = false;
    public int MaxLogFileSizeMB { get; set; } = 100;
    public int RetainLogDays { get; set; } = 30;
}

public class UpdatePerformanceConfigurationRequest
{
    public int RequestTimeoutSeconds { get; set; } = 30;
    public int MaxConcurrentRequests { get; set; } = 1000;
    public bool EnableResponseCompression { get; set; } = true;
    public bool EnableResponseCaching { get; set; } = true;
}

public class UpdateGeneralSettingsRequest
{
    public string SiteName { get; set; } = string.Empty;
    public string SiteDescription { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string TimeZone { get; set; } = "UTC";
    public string DefaultLanguage { get; set; } = "en";
}

public class UpdateEmailSettingsRequest
{
    public string SmtpServer { get; set; } = string.Empty;
    public int SmtpPort { get; set; } = 587;
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = true;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
}

public class UpdateSeoSettingsRequest
{
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public string MetaKeywords { get; set; } = string.Empty;
    public string OgTitle { get; set; } = string.Empty;
    public string OgDescription { get; set; } = string.Empty;
    public string OgImage { get; set; } = string.Empty;
}

public class UpdateSocialMediaSettingsRequest
{
    public string? Facebook { get; set; }
    public string? Twitter { get; set; }
    public string? Instagram { get; set; }
    public string? LinkedIn { get; set; }
    public string? YouTube { get; set; }
    public string? TikTok { get; set; }
}

public class UpdateMaintenanceSettingsRequest
{
    public bool IsMaintenanceMode { get; set; }
    public string MaintenanceMessage { get; set; } = string.Empty;
    public DateTime? MaintenanceStartTime { get; set; }
    public DateTime? MaintenanceEndTime { get; set; }
    public string[] AllowedIpAddresses { get; set; } = Array.Empty<string>();
}

public class ClearCacheRequest
{
    public string CacheType { get; set; } = "all"; // "all", "memory", "redis", "database"
}

public class RestartServicesRequest
{
    public string[] ServiceNames { get; set; } = Array.Empty<string>();
    public bool ForceRestart { get; set; } = false;
}

public class UpdateFeatureFlagsRequest
{
    public Dictionary<string, bool> FeatureFlags { get; set; } = new();
}