namespace Domain.DomainEvents.Shared.Search;

public class SearchIndexUpdatedEvent : BaseDomainEvent
{
    public string EntityType { get; }
    public Guid EntityId { get; }
    public string Operation { get; } // Created, Updated, Deleted
    public string? Title { get; }

    public SearchIndexUpdatedEvent(string entityType, Guid entityId, string operation, string? title = null)
    {
        EntityType = entityType;
        EntityId = entityId;
        Operation = operation;
        Title = title;
    }
}