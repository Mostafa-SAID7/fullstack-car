namespace Domain.ValueObjects.Admin;

public class SystemHealth : ValueObject
{
    public string ComponentName { get; }
    public string Status { get; }
    public double ResponseTime { get; }
    public DateTime LastChecked { get; }
    public string? ErrorMessage { get; }
    public Dictionary<string, object> Metrics { get; }

    public SystemHealth(string componentName, string status, double responseTime, 
        DateTime lastChecked, string? errorMessage = null, Dictionary<string, object>? metrics = null)
    {
        if (string.IsNullOrWhiteSpace(componentName))
            throw new ArgumentException("Component name cannot be empty", nameof(componentName));

        if (string.IsNullOrWhiteSpace(status))
            throw new ArgumentException("Status cannot be empty", nameof(status));

        if (responseTime < 0)
            throw new ArgumentException("Response time cannot be negative", nameof(responseTime));

        ComponentName = componentName;
        Status = status;
        ResponseTime = responseTime;
        LastChecked = lastChecked;
        ErrorMessage = errorMessage;
        Metrics = metrics ?? new Dictionary<string, object>();
    }

    public bool IsHealthy => Status.Equals("Healthy", StringComparison.OrdinalIgnoreCase);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return ComponentName;
        yield return Status;
        yield return ResponseTime;
        yield return LastChecked;
        yield return ErrorMessage ?? string.Empty;
        foreach (var metric in Metrics.OrderBy(x => x.Key))
        {
            yield return metric.Key;
            yield return metric.Value;
        }
    }
}