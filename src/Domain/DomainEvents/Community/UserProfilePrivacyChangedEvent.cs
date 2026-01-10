using Domain.DomainEvents;

namespace Domain.DomainEvents.Community
{
    public class UserProfilePrivacyChangedEvent : BaseDomainEvent
    {
        public Guid ProfileId { get; }
        public Guid UserId { get; }
        public bool IsPrivate { get; }

        public UserProfilePrivacyChangedEvent(Guid profileId, Guid userId, bool isPrivate)
        {
            ProfileId = profileId;
            UserId = userId;
            IsPrivate = isPrivate;
        }
    }
}