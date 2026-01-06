namespace Domain.DomainEvents.Shared.Common;

public class EntityUpdatedEvent<T> : BaseDomainEvent where T : BaseEntity
{
    public Guid EntityId { get; }
    public string EntityType { get; }
    public T Entity { get; }
    public Dictionary<string, object> Changes { get; }

    public EntityUpdatedEvent(T entity, Dictionary<string, object> changes)
    {
        EntityId = entity.Id;
        EntityType = typeof(T).Name;
        Entity = entity;
        Changes = changes;
    }
}
