using Domain.Base;
using Domain.Enums.Media;

namespace Domain.Entities.Media;

public class MediaAnalytics : BaseEntity
{
    public Guid MediaId { get; set; }
    public MediaType MediaType { get; set; }
    public int ViewsToday { get; set; } = 0;
    public int ViewsWeek { get; set; } = 0;
    public int ViewsMonth { get; set; } = 0;
    public int ViewsTotal { get; set; } = 0;
    public int LikesCount { get; set; } = 0;
    public int DislikesCount { get; set; } = 0;
    public int CommentsCount { get; set; } = 0;
    public int SharesCount { get; set; } = 0;
    public decimal AverageWatchTime { get; set; } = 0;
    public decimal CompletionRate { get; set; } = 0;
    public string? TopCountries { get; set; } // JSON array of top countries
    public string? TopDevices { get; set; } // JSON array of top devices
    public string? TopReferrers { get; set; } // JSON array of top referrers
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}