using Domain.Enums.Common;

namespace Application.Features.Common.Views.DTOs.Responses;

public class ViewStatsResponse
{
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public int TotalViews { get; set; }
    public int UniqueViews { get; set; }
    public int ViewsToday { get; set; }
    public int ViewsThisWeek { get; set; }
    public int ViewsThisMonth { get; set; }
    public DateTime LastViewedAt { get; set; }
    public List<ViewTrendData> ViewTrends { get; set; } = new();
}

public class ViewTrendData
{
    public DateTime Date { get; set; }
    public int ViewCount { get; set; }
    public int UniqueViewCount { get; set; }
}