namespace Application.Features.Media.Analytics.DTOs;

public class AnalyticsTrendsDto
{
    public List<MetricTrendDto> MetricTrends { get; set; } = new();
    public TrendSummaryDto Summary { get; set; } = new();
    public List<TrendInsightDto> Insights { get; set; } = new();
    public TrendPredictionDto? Predictions { get; set; }
    public ComparisonDataDto? Comparison { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string TimeRange { get; set; } = string.Empty;
    public string Granularity { get; set; } = string.Empty;
}

public class MetricTrendDto
{
    public string MetricName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public List<TrendDataPointDto> DataPoints { get; set; } = new();
    public TrendStatisticsDto Statistics { get; set; } = new();
    public string TrendDirection { get; set; } = string.Empty; // Up, Down, Stable
    public double TrendStrength { get; set; } // 0-1 scale
}

public class TrendSummaryDto
{
    public double OverallGrowthRate { get; set; }
    public string DominantTrend { get; set; } = string.Empty;
    public DateTime PeakDate { get; set; }
    public long PeakValue { get; set; }
    public DateTime LowestDate { get; set; }
    public long LowestValue { get; set; }
    public double Volatility { get; set; }
}

public class TrendInsightDto
{
    public string Type { get; set; } = string.Empty; // Growth, Decline, Spike, Pattern
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? Date { get; set; }
    public double Impact { get; set; } // 0-1 scale
    public string Recommendation { get; set; } = string.Empty;
}

public class TrendPredictionDto
{
    public List<TrendDataPointDto> PredictedValues { get; set; } = new();
    public double ConfidenceLevel { get; set; }
    public string Model { get; set; } = string.Empty;
    public Dictionary<string, double> Factors { get; set; } = new();
}

public class TrendStatisticsDto
{
    public double Average { get; set; }
    public double Median { get; set; }
    public double StandardDeviation { get; set; }
    public double Min { get; set; }
    public double Max { get; set; }
    public double GrowthRate { get; set; }
    public double Correlation { get; set; } // With other metrics
}