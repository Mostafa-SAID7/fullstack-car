namespace Domain.DomainEvents.Admin.Analytics;

public class AnalyticsDataGeneratedEvent : BaseDomainEvent
{
    public string ReportType { get; }
    public DateTime PeriodStart { get; }
    public DateTime PeriodEnd { get; }
    public int RecordsCount { get; }
    public Guid GeneratedByUserId { get; }

    public AnalyticsDataGeneratedEvent(string reportType, DateTime periodStart, DateTime periodEnd, 
        int recordsCount, Guid generatedByUserId)
    {
        ReportType = reportType;
        PeriodStart = periodStart;
        PeriodEnd = periodEnd;
        RecordsCount = recordsCount;
        GeneratedByUserId = generatedByUserId;
    }
}
