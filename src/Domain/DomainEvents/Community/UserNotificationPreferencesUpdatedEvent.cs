using Domain.DomainEvents;
using Domain.ValueObjects.Community.Social;

namespace Domain.DomainEvents.Community
{
    public class UserNotificationPreferencesUpdatedEvent : BaseDomainEvent
    {
        public Guid ProfileId { get; }
        public Guid UserId { get; }
        public NotificationPreferences OldNotificationPreferences { get; }
        public NotificationPreferences NewNotificationPreferences { get; }

        public UserNotificationPreferencesUpdatedEvent(
            Guid profileId, 
            Guid userId, 
            NotificationPreferences oldNotificationPreferences, 
            NotificationPreferences newNotificationPreferences)
        {
            ProfileId = profileId;
            UserId = userId;
            OldNotificationPreferences = oldNotificationPreferences;
            NewNotificationPreferences = newNotificationPreferences;
        }
    }
}