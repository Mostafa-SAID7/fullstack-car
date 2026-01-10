using Domain.DomainEvents;
using Domain.ValueObjects.Community.Social;

namespace Domain.DomainEvents.Community
{
    public class UserPrivacySettingsUpdatedEvent : BaseDomainEvent
    {
        public Guid ProfileId { get; }
        public Guid UserId { get; }
        public ProfilePrivacySettings OldPrivacySettings { get; }
        public ProfilePrivacySettings NewPrivacySettings { get; }

        public UserPrivacySettingsUpdatedEvent(
            Guid profileId, 
            Guid userId, 
            ProfilePrivacySettings oldPrivacySettings, 
            ProfilePrivacySettings newPrivacySettings)
        {
            ProfileId = profileId;
            UserId = userId;
            OldPrivacySettings = oldPrivacySettings;
            NewPrivacySettings = newPrivacySettings;
        }
    }
}