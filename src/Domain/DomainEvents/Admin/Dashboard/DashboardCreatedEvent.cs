namespace Domain.DomainEvents.Admin.Dashboard;

public class DashboardCreatedEvent : BaseDomainEvent
{
    public Guid DashboardLayoutId { get; }
    public string DashboardName { get; }
    public Guid CreatedByUserId { get; }
    public bool IsPublic { get; }

    public DashboardCreatedEvent(Guid dashboardLayoutId, string dashboardName, 
        Guid createdByUserId, bool isPublic)
    {
        DashboardLayoutId = dashboardLayoutId;
        DashboardName = dashboardName;
        CreatedByUserId = createdByUserId;
        IsPublic = isPublic;
    }
}
