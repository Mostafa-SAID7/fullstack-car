using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Analytics.Handlers;

public class GetAnalyticsTrendsHandler : IRequestHandler<GetAnalyticsTrendsQuery, Result<AnalyticsTrendsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAnalyticsTrendsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AnalyticsTrendsDto>> Handle(GetAnalyticsTrendsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (fromDate, toDate) = GetDateRange(request.TimeRange, request.FromDate, request.ToDate);

            var trends = new AnalyticsTrendsDto
            {
                TimeRange = request.TimeRange,
                Granularity = request.Granularity
            };

            // Generate trends for each requested metric
            foreach (var metric in request.Metrics)
            {
                var metricTrend = await GenerateMetricTrend(metric, fromDate, toDate, request.Granularity, cancellationToken);
                trends.MetricTrends.Add(metricTrend);
            }

            // Generate summary
            trends.Summary = GenerateTrendSummary(trends.MetricTrends);

            // Generate insights
            trends.Insights = GenerateInsights(trends.MetricTrends);

            return Result<AnalyticsTrendsDto>.Success(trends);
        }
        catch (Exception ex)
        {
            return Result<AnalyticsTrendsDto>.Failure(new[] { $"Error retrieving analytics trends: {ex.Message}" });
        }
    }

    private async Task<MetricTrendDto> GenerateMetricTrend(string metric, DateTime fromDate, DateTime toDate, string granularity, CancellationToken cancellationToken)
    {
        var dataPoints = new List<TrendDataPointDto>();
        var interval = GetInterval(granularity);
        var current = fromDate;

        while (current <= toDate)
        {
            var next = current.Add(interval);
            var value = await GetMetricValue(metric, current, next, cancellationToken);
            
            dataPoints.Add(new TrendDataPointDto
            {
                Date = current,
                Value = value
            });

            current = next;
        }

        return new MetricTrendDto
        {
            MetricName = metric,
            DisplayName = GetDisplayName(metric),
            DataPoints = dataPoints,
            Statistics = CalculateStatistics(dataPoints),
            TrendDirection = DetermineTrendDirection(dataPoints),
            TrendStrength = CalculateTrendStrength(dataPoints)
        };
    }

    private async Task<long> GetMetricValue(string metric, DateTime from, DateTime to, CancellationToken cancellationToken)
    {
        return metric.ToLower() switch
        {
            "views" => await _context.VideoViews
                .Where(vv => vv.CreatedAt >= from && vv.CreatedAt < to && vv.IsUnique)
                .LongCountAsync(cancellationToken),
            "plays" => await _context.PodcastPlays
                .Where(pp => pp.CreatedAt >= from && pp.CreatedAt < to && pp.IsUnique)
                .LongCountAsync(cancellationToken),
            "engagement" => await _context.VideoLikes
                .Where(vl => vl.CreatedAt >= from && vl.CreatedAt < to)
                .LongCountAsync(cancellationToken) +
                await _context.PodcastLikes
                .Where(pl => pl.CreatedAt >= from && pl.CreatedAt < to)
                .LongCountAsync(cancellationToken),
            "subscribers" => await _context.PodcastSubscriptions
                .Where(ps => ps.CreatedAt >= from && ps.CreatedAt < to)
                .LongCountAsync(cancellationToken),
            _ => 0
        };
    }

    private TimeSpan GetInterval(string granularity)
    {
        return granularity.ToLower() switch
        {
            "hourly" => TimeSpan.FromHours(1),
            "daily" => TimeSpan.FromDays(1),
            "weekly" => TimeSpan.FromDays(7),
            "monthly" => TimeSpan.FromDays(30),
            _ => TimeSpan.FromDays(1)
        };
    }

    private string GetDisplayName(string metric)
    {
        return metric.ToLower() switch
        {
            "views" => "Video Views",
            "plays" => "Podcast Plays",
            "engagement" => "Total Engagement",
            "subscribers" => "New Subscribers",
            _ => metric
        };
    }

    private TrendStatisticsDto CalculateStatistics(List<TrendDataPointDto> dataPoints)
    {
        if (!dataPoints.Any()) return new TrendStatisticsDto();

        var values = dataPoints.Select(dp => (double)dp.Value).ToList();
        
        return new TrendStatisticsDto
        {
            Average = values.Average(),
            Min = values.Min(),
            Max = values.Max(),
            StandardDeviation = CalculateStandardDeviation(values),
            GrowthRate = CalculateGrowthRate(dataPoints)
        };
    }

    private string DetermineTrendDirection(List<TrendDataPointDto> dataPoints)
    {
        if (dataPoints.Count < 2) return "Stable";

        var firstHalf = dataPoints.Take(dataPoints.Count / 2).Average(dp => dp.Value);
        var secondHalf = dataPoints.Skip(dataPoints.Count / 2).Average(dp => dp.Value);

        if (secondHalf > firstHalf * 1.05) return "Up";
        if (secondHalf < firstHalf * 0.95) return "Down";
        return "Stable";
    }

    private double CalculateTrendStrength(List<TrendDataPointDto> dataPoints)
    {
        // Simplified trend strength calculation
        if (dataPoints.Count < 2) return 0;

        var values = dataPoints.Select(dp => (double)dp.Value).ToList();
        var correlation = CalculateCorrelation(values);
        return Math.Abs(correlation);
    }

    private TrendSummaryDto GenerateTrendSummary(List<MetricTrendDto> metricTrends)
    {
        var allDataPoints = metricTrends.SelectMany(mt => mt.DataPoints).ToList();
        if (!allDataPoints.Any()) return new TrendSummaryDto();

        var peakPoint = allDataPoints.OrderByDescending(dp => dp.Value).First();
        var lowestPoint = allDataPoints.OrderBy(dp => dp.Value).First();

        return new TrendSummaryDto
        {
            DominantTrend = metricTrends.GroupBy(mt => mt.TrendDirection)
                .OrderByDescending(g => g.Count())
                .First().Key,
            PeakDate = peakPoint.Date,
            PeakValue = peakPoint.Value,
            LowestDate = lowestPoint.Date,
            LowestValue = lowestPoint.Value
        };
    }

    private List<TrendInsightDto> GenerateInsights(List<MetricTrendDto> metricTrends)
    {
        var insights = new List<TrendInsightDto>();

        foreach (var trend in metricTrends)
        {
            if (trend.TrendDirection == "Up" && trend.TrendStrength > 0.7)
            {
                insights.Add(new TrendInsightDto
                {
                    Type = "Growth",
                    Title = $"Strong Growth in {trend.DisplayName}",
                    Description = $"{trend.DisplayName} is showing strong upward trend",
                    Impact = trend.TrendStrength,
                    Recommendation = "Continue current strategies to maintain growth"
                });
            }
        }

        return insights;
    }

    private double CalculateStandardDeviation(List<double> values)
    {
        if (values.Count < 2) return 0;
        
        var mean = values.Average();
        var variance = values.Sum(v => Math.Pow(v - mean, 2)) / values.Count;
        return Math.Sqrt(variance);
    }

    private double CalculateGrowthRate(List<TrendDataPointDto> dataPoints)
    {
        if (dataPoints.Count < 2) return 0;

        var first = dataPoints.First().Value;
        var last = dataPoints.Last().Value;
        
        if (first == 0) return 0;
        return ((double)(last - first) / first) * 100;
    }

    private double CalculateCorrelation(List<double> values)
    {
        // Simplified correlation with time (index)
        if (values.Count < 2) return 0;

        var indices = Enumerable.Range(0, values.Count).Select(i => (double)i).ToList();
        var meanX = indices.Average();
        var meanY = values.Average();

        var numerator = indices.Zip(values, (x, y) => (x - meanX) * (y - meanY)).Sum();
        var denominator = Math.Sqrt(indices.Sum(x => Math.Pow(x - meanX, 2)) * values.Sum(y => Math.Pow(y - meanY, 2)));

        return denominator == 0 ? 0 : numerator / denominator;
    }

    private (DateTime fromDate, DateTime toDate) GetDateRange(string timeRange, DateTime? fromDate, DateTime? toDate)
    {
        if (fromDate.HasValue && toDate.HasValue)
        {
            return (fromDate.Value, toDate.Value);
        }

        var now = DateTime.UtcNow;
        return timeRange.ToLower() switch
        {
            "1d" => (now.AddDays(-1), now),
            "7d" => (now.AddDays(-7), now),
            "30d" => (now.AddDays(-30), now),
            "90d" => (now.AddDays(-90), now),
            "1y" => (now.AddYears(-1), now),
            _ => (now.AddDays(-30), now)
        };
    }
}