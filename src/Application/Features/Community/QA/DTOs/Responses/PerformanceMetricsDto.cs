namespace Application.Features.Community.QA.DTOs.Responses;

public class PerformanceMetricsDto
{
    public DateTime Timestamp { get; set; }
    public List<MetricDataPointDto> QuestionTrends { get; set; } = new();
    public List<MetricDataPointDto> AnswerTrends { get; set; } = new();
    public List<MetricDataPointDto> VoteTrends { get; set; } = new();
    public double AverageResponseTime { get; set; }
    public double QuestionResolutionRate { get; set; }
    public int ActiveUsers { get; set; }
    public int ActiveExperts { get; set; }
    public SystemLoadDto SystemLoad { get; set; } = new();
    
    // Additional properties referenced in services
    public double ExpertResponseRate { get; set; }
    public SearchPerformanceDto? SearchPerformance { get; set; }
}

public class SearchPerformanceDto
{
    public double AverageSearchTime { get; set; }
    public int SearchesPerSecond { get; set; }
    public double IndexSize { get; set; }
    public DateTime LastIndexUpdate { get; set; }
}