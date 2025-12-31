using Domain.Enums.Admin.System;

namespace Domain.DomainEvents.Admin;

public class SystemConfigurationChangedEvent : BaseDomainEvent
{
    public string ConfigurationKey { get; }
    public string? OldValue { get; }
    public string NewValue { get; }
    public ConfigurationType ConfigurationType { get; }
    public Guid ChangedByUserId { get; }

    public SystemConfigurationChangedEvent(string configurationKey, string? oldValue, 
        string newValue, ConfigurationType configurationType, Guid changedByUserId)
    {
        ConfigurationKey = configurationKey;
        OldValue = oldValue;
        NewValue = newValue;
        ConfigurationType = configurationType;
        ChangedByUserId = changedByUserId;
    }
}