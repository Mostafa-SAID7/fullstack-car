namespace Domain.DomainEvents.Shared.Common;

public class EntityCreatedEvent<T> : BaseDomainEvent where T : BaseEntity
{
    public Guid EntityId { get; }
    public string EntityType { get; }
    public T Entity { get; }

    public EntityCreatedEvent(T entity)
    {
        EntityId = entity.Id;
        EntityType = typeof(T).Name;
        Entity = entity;
    }
}
