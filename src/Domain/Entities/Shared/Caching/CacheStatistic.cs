namespace Domain.Entities.Shared.Caching;

public class CacheStatistic : BaseEntity
{
    public string Region { get; set; } = string.Empty;
    public long TotalHits { get; set; }
    public long TotalMisses { get; set; }
    public long TotalEvictions { get; set; }
    public long TotalEntries { get; set; }
    public long TotalSizeInBytes { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public double HitRatio => TotalHits + TotalMisses > 0 ? (double)TotalHits / (TotalHits + TotalMisses) : 0;
}
