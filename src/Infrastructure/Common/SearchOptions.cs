namespace Infrastructure.Common;

public class SearchOptions
{
    public const string SectionName = "Search";
    
    public int MaxResults { get; set; } = 100;
    public int DefaultPageSize { get; set; } = 20;
    public bool EnableFuzzySearch { get; set; } = true;
    public double FuzzyThreshold { get; set; } = 0.7;
    public int CacheExpirationMinutes { get; set; } = 30;
    public bool EnableSearchAnalytics { get; set; } = true;
}