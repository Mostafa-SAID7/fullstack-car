using Domain.Enums.Admin.System;

namespace Domain.ValueObjects.Admin;

public class AuditTrail : ValueObject
{
    public AuditActionType ActionType { get; }
    public string EntityName { get; }
    public string EntityId { get; }
    public string? OldValues { get; }
    public string? NewValues { get; }
    public DateTime Timestamp { get; }
    public string IpAddress { get; }
    public string UserAgent { get; }

    public AuditTrail(AuditActionType actionType, string entityName, string entityId,
        string? oldValues, string? newValues, DateTime timestamp, string ipAddress, string userAgent)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name cannot be empty", nameof(entityName));
        
        if (string.IsNullOrWhiteSpace(entityId))
            throw new ArgumentException("Entity ID cannot be empty", nameof(entityId));

        if (string.IsNullOrWhiteSpace(ipAddress))
            throw new ArgumentException("IP address cannot be empty", nameof(ipAddress));

        ActionType = actionType;
        EntityName = entityName;
        EntityId = entityId;
        OldValues = oldValues;
        NewValues = newValues;
        Timestamp = timestamp;
        IpAddress = ipAddress;
        UserAgent = userAgent ?? string.Empty;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return ActionType;
        yield return EntityName;
        yield return EntityId;
        yield return OldValues ?? string.Empty;
        yield return NewValues ?? string.Empty;
        yield return Timestamp;
        yield return IpAddress;
        yield return UserAgent;
    }
}
