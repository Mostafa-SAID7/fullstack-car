namespace Infrastructure.Common
{
    public class AnalyticsSettings
    {
        public bool Enabled { get; set; } = true;
        public bool EnableRealTimeAnalytics { get; set; } = true;
        public bool EnablePerformanceMonitoring { get; set; } = true;
        public bool EnableSecurityMonitoring { get; set; } = true;
        public int DefaultTrendDays { get; set; } = 30;
        public int MaxTrendDays { get; set; } = 365;
        public int CacheExpirationMinutes { get; set; } = 15;
        public int BatchSize { get; set; } = 1000;
        public bool EnableDataAggregation { get; set; } = true;
        public string DefaultGranularity { get; set; } = "day";
        public List<string> SupportedGranularities { get; set; } = new() { "hour", "day", "week", "month" };
        public int MaxRecordsPerQuery { get; set; } = 10000;
        public bool EnableExportFeatures { get; set; } = true;
        public List<string> SupportedExportFormats { get; set; } = new() { "csv", "excel", "json", "pdf" };
        public string ExportStoragePath { get; set; } = "exports/analytics";
        public int ExportRetentionDays { get; set; } = 30;
        public bool EnableAlerts { get; set; } = true;
        public double HighCpuThreshold { get; set; } = 80.0;
        public double HighMemoryThreshold { get; set; } = 80.0;
        public double HighErrorRateThreshold { get; set; } = 5.0;
        public int SecurityIncidentThreshold { get; set; } = 10;
        public bool EnableAutomaticReports { get; set; } = true;
        public List<string> ReportRecipients { get; set; } = new();
        public string ReportSchedule { get; set; } = "daily"; // daily, weekly, monthly
    }
}