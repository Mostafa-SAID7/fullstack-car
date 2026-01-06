namespace Application.Features.Admin.Analytics.DTOs.Responses
{
    public class ExportAnalyticsResponse
    {
        public string ExportId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // "Processing", "Completed", "Failed"
        public string Format { get; set; } = string.Empty;
        public string? DownloadUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public string? ErrorMessage { get; set; }
        public long? FileSizeBytes { get; set; }
    }
}
