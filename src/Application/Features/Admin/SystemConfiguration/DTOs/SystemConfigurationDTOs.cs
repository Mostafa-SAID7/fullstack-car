namespace Application.Features.Admin.SystemConfiguration.DTOs;

public class SystemConfigurationDto
{
    public bool DatabaseConnected { get; set; }
    public bool CacheEnabled { get; set; }
    public string LogLevel { get; set; } = string.Empty;
    public Dictionary<string, bool> FeatureFlags { get; set; } = new();
}