namespace Infrastructure.Common;

public class StaticAssetOptions
{
    public const string SectionName = "StaticAssets";
    
    public string BasePath { get; set; } = "/assets";
    public bool EnableCompression { get; set; } = true;
    public bool EnableCaching { get; set; } = true;
    public int CacheExpirationDays { get; set; } = 30;
    public string[] CompressibleTypes { get; set; } = { ".css", ".js", ".html", ".json" };
}