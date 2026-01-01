namespace Domain.DomainEvents.Shared.Common;

public class EntityDeletedEvent<T> : BaseDomainEvent where T : BaseEntity
{
    public Guid EntityId { get; }
    public string EntityType { get; }
    public bool IsSoftDelete { get; }

    public EntityDeletedEvent(Guid entityId, bool isSoftDelete = true)
    {
        EntityId = entityId;
        EntityType = typeof(T).Name;
        IsSoftDelete = isSoftDelete;
    }
}