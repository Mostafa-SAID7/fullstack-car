namespace Application.Features.Filters.Trends.DTOs.Responses;

public class TrendsResponse
{
    public List<TrendItem> Items { get; set; } = new();
    public string TimeFrame { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public TrendMetrics Metrics { get; set; } = new();
}

public class TrendItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public int Views { get; set; }
    public int Votes { get; set; }
    public int Comments { get; set; }
    public int Shares { get; set; }
    public double TrendScore { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class TrendMetrics
{
    public int TotalTrends { get; set; }
    public double AverageTrendScore { get; set; }
    public string TopCategory { get; set; } = string.Empty;
    public List<string> TopTags { get; set; } = new();
}