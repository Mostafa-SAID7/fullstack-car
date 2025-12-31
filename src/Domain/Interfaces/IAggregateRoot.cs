using Domain.DomainEvents;

namespace Domain.Interfaces
{
    public interface IAggregateRoot
    {
        IReadOnlyCollection<BaseDomainEvent> DomainEvents { get; }
        void AddDomainEvent(BaseDomainEvent domainEvent);
        void RemoveDomainEvent(BaseDomainEvent domainEvent);
        void ClearDomainEvents();
    }
}