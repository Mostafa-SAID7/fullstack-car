namespace Domain.DomainEvents.Marketplace.Services;

public class ServiceCreatedEvent : BaseDomainEvent
{
    public Guid ServiceId { get; }
    public Guid ProviderId { get; }
    public string ServiceName { get; }
    public string Category { get; }
    public decimal Price { get; }

    public ServiceCreatedEvent(Guid serviceId, Guid providerId, string serviceName, string category, decimal price)
    {
        ServiceId = serviceId;
        ProviderId = providerId;
        ServiceName = serviceName;
        Category = category;
        Price = price;
    }
}
