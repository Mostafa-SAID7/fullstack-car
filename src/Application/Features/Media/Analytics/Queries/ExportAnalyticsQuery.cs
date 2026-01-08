using Application.Common.Models;
using Application.Features.Media.Analytics.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Analytics.Queries;

public class ExportAnalyticsQuery : IRequest<Result<ExportDataDto>>
{
    public Guid? UserId { get; set; }
    public Guid? CreatorId { get; set; }
    public MediaType? MediaType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string Format { get; set; } = "CSV"; // CSV, JSON, XLSX
    public ExportType ExportType { get; set; } = ExportType.Summary;
    public bool IncludePersonalData { get; set; } = false;
    public string? EmailTo { get; set; } // For email delivery
}

public enum ExportType
{
    Summary,
    Detailed,
    Views,
    Engagement,
    Demographics,
    Performance
}