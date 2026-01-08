using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Application.Features.Media.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace Application.Features.Media.Analytics.Handlers;

public class ExportAnalyticsHandler : IRequestHandler<ExportAnalyticsQuery, Result<ExportDataDto>>
{
    private readonly IApplicationDbContext _context;

    public ExportAnalyticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ExportDataDto>> Handle(ExportAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (fromDate, toDate) = GetDateRange(request.FromDate, request.ToDate);
            
            var exportData = request.ExportType switch
            {
                ExportType.Summary => await ExportSummary(request, fromDate, toDate, cancellationToken),
                ExportType.Views => await ExportViews(request, fromDate, toDate, cancellationToken),
                ExportType.Engagement => await ExportEngagement(request, fromDate, toDate, cancellationToken),
                _ => await ExportSummary(request, fromDate, toDate, cancellationToken)
            };

            return Result<ExportDataDto>.Success(exportData);
        }
        catch (Exception ex)
        {
            return Result<ExportDataDto>.Failure(new[] { $"Error exporting analytics data: {ex.Message}" });
        }
    }

    private async Task<ExportDataDto> ExportSummary(ExportAnalyticsQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var data = new List<object>();

        // Get video analytics
        var videoAnalytics = await _context.Videos
            .Where(v => !v.IsDeleted && v.CreatedAt >= fromDate && v.CreatedAt <= toDate)
            .Select(v => new
            {
                Type = "Video",
                v.Id,
                v.Title,
                v.ViewCount,
                v.LikeCount,
                v.DislikeCount,
                v.CreatedAt,
                v.PublishedAt
            })
            .ToListAsync(cancellationToken);

        // Get podcast analytics
        var podcastAnalytics = await _context.Podcasts
            .Where(p => !p.IsDeleted && p.CreatedAt >= fromDate && p.CreatedAt <= toDate)
            .Select(p => new
            {
                Type = "Podcast",
                p.Id,
                p.Title,
                ViewCount = p.PlayCount,
                p.LikeCount,
                DislikeCount = 0,
                p.CreatedAt,
                p.PublishedAt
            })
            .ToListAsync(cancellationToken);

        data.AddRange(videoAnalytics);
        data.AddRange(podcastAnalytics);

        return CreateExportData(data, request.Format, "summary", fromDate, toDate);
    }

    private async Task<ExportDataDto> ExportViews(ExportAnalyticsQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var videoViews = await _context.VideoViews
            .Where(vv => vv.CreatedAt >= fromDate && vv.CreatedAt <= toDate)
            .Select(vv => new
            {
                Type = "Video",
                MediaId = vv.VideoId,
                vv.UserId,
                vv.Country,
                vv.Device,
                vv.WatchTimeSeconds,
                vv.CompletionPercentage,
                vv.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var podcastPlays = await _context.PodcastPlays
            .Where(pp => pp.CreatedAt >= fromDate && pp.CreatedAt <= toDate)
            .Select(pp => new
            {
                Type = "Podcast",
                MediaId = pp.PodcastId,
                pp.UserId,
                pp.Country,
                pp.Device,
                WatchTimeSeconds = pp.ListenTimeSeconds,
                pp.CompletionPercentage,
                pp.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var data = videoViews.Cast<object>().Concat(podcastPlays.Cast<object>()).ToList();

        return CreateExportData(data, request.Format, "views", fromDate, toDate);
    }

    private async Task<ExportDataDto> ExportEngagement(ExportAnalyticsQuery request, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken)
    {
        var videoLikes = await _context.VideoLikes
            .Where(vl => vl.CreatedAt >= fromDate && vl.CreatedAt <= toDate)
            .Select(vl => new
            {
                Type = "Video",
                MediaId = vl.VideoId,
                vl.UserId,
                EngagementType = "Like",
                vl.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var podcastLikes = await _context.PodcastLikes
            .Where(pl => pl.CreatedAt >= fromDate && pl.CreatedAt <= toDate)
            .Select(pl => new
            {
                Type = "Podcast",
                MediaId = pl.PodcastId,
                pl.UserId,
                EngagementType = "Like",
                pl.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var data = videoLikes.Cast<object>().Concat(podcastLikes.Cast<object>()).ToList();

        return CreateExportData(data, request.Format, "engagement", fromDate, toDate);
    }

    private ExportDataDto CreateExportData(List<object> data, string format, string exportType, DateTime fromDate, DateTime toDate)
    {
        byte[] fileData;
        string contentType;
        string fileName;

        switch (format.ToUpper())
        {
            case "JSON":
                var jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                fileData = Encoding.UTF8.GetBytes(jsonString);
                contentType = "application/json";
                fileName = $"analytics-{exportType}-{DateTime.UtcNow:yyyyMMdd-HHmmss}.json";
                break;

            case "CSV":
            default:
                var csvString = ConvertToCsv(data);
                fileData = Encoding.UTF8.GetBytes(csvString);
                contentType = "text/csv";
                fileName = $"analytics-{exportType}-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
                break;
        }

        return new ExportDataDto
        {
            Data = fileData,
            FileName = fileName,
            ContentType = contentType,
            FileSize = fileData.Length,
            Format = format.ToUpper(),
            Metadata = new ExportMetadataDto
            {
                ExportType = exportType,
                FromDate = fromDate,
                ToDate = toDate,
                RecordCount = data.Count,
                RequestedBy = "System" // Would be actual user
            }
        };
    }

    private string ConvertToCsv(List<object> data)
    {
        if (!data.Any()) return string.Empty;

        var sb = new StringBuilder();
        
        // Get headers from first object
        var firstItem = data.First();
        var properties = firstItem.GetType().GetProperties();
        var headers = string.Join(",", properties.Select(p => p.Name));
        sb.AppendLine(headers);

        // Add data rows
        foreach (var item in data)
        {
            var values = properties.Select(p => p.GetValue(item)?.ToString() ?? "").ToArray();
            var row = string.Join(",", values.Select(v => $"\"{v}\""));
            sb.AppendLine(row);
        }

        return sb.ToString();
    }

    private (DateTime fromDate, DateTime toDate) GetDateRange(DateTime? fromDate, DateTime? toDate)
    {
        var now = DateTime.UtcNow;
        return (fromDate ?? now.AddDays(-30), toDate ?? now);
    }
}