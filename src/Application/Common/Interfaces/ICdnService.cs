namespace Application.Common.Interfaces;

public interface ICdnService
{
    string GetCdnUrl(string fileUrl);
    Task<bool> PurgeFileFromCdnAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<bool> PurgeFileFromCdnAsync(IEnumerable<string> fileUrls, CancellationToken cancellationToken = default);
    Task<CdnStatistics> GetCdnStatisticsAsync(string fileUrl, CancellationToken cancellationToken = default);
}

public class CdnStatistics
{
    public long TotalRequests { get; set; }
    public long TotalBandwidth { get; set; }
    public double CacheHitRatio { get; set; }
    public DateTime LastAccessed { get; set; }
}