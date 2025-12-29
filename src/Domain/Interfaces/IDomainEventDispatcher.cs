using Domain.DomainEvents;

namespace Domain.Interfaces
{
    public interface IDomainEventDispatcher
    {
        Task DispatchAsync(BaseDomainEvent domainEvent);
        Task DispatchAsync(IEnumerable<BaseDomainEvent> domainEvents);
    }
}