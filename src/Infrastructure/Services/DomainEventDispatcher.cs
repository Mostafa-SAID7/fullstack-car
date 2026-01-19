using Domain.DomainEvents;
using Domain.Interfaces;
using MediatR;

namespace Infrastructure.Services
{
    public class DomainEventDispatcher : IDomainEventDispatcher
    {
        private readonly IMediator _mediator;

        public DomainEventDispatcher(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task DispatchAsync(BaseDomainEvent domainEvent)
        {
            await _mediator.Publish(domainEvent);
        }

        public async Task DispatchAsync(IEnumerable<BaseDomainEvent> domainEvents)
        {
            foreach (var domainEvent in domainEvents)
            {
                await _mediator.Publish(domainEvent);
            }
        }
    }
}
