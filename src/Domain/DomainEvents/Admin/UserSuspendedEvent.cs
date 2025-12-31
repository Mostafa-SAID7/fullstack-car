using Domain.Enums.Admin.Management;

namespace Domain.DomainEvents.Admin;

public class UserSuspendedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public Guid SuspendedByUserId { get; }
    public SuspensionReason Reason { get; }
    public DateTime SuspensionEndDate { get; }
    public string Notes { get; }

    public UserSuspendedEvent(Guid userId, Guid suspendedByUserId, SuspensionReason reason, 
        DateTime suspensionEndDate, string notes)
    {
        UserId = userId;
        SuspendedByUserId = suspendedByUserId;
        Reason = reason;
        SuspensionEndDate = suspensionEndDate;
        Notes = notes;
    }
}