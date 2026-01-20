namespace Infrastructure.Common;

public class CdnOptions
{
    public const string SectionName = "Cdn";
    
    public string BaseUrl { get; set; } = string.Empty;
    public bool EnableCdn { get; set; } = false;
    public int CacheExpirationHours { get; set; } = 24;
    public string[] AllowedFileTypes { get; set; } = { ".jpg", ".png", ".gif", ".css", ".js" };
    public long MaxFileSizeBytes { get; set; } = 10 * 1024 * 1024; // 10MB
}