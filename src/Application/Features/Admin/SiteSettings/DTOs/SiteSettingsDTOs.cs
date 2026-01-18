namespace Application.Features.Admin.SiteSettings.DTOs;

public class SiteSettingsDto
{
    public string SiteName { get; set; } = string.Empty;
    public string SiteDescription { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public bool MaintenanceMode { get; set; }
    public string MaintenanceMessage { get; set; } = string.Empty;
}