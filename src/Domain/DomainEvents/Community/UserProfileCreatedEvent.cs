using Domain.DomainEvents;

namespace Domain.DomainEvents.Community
{
    public class UserProfileCreatedEvent : BaseDomainEvent
    {
        public Guid ProfileId { get; }
        public Guid UserId { get; }

        public UserProfileCreatedEvent(Guid profileId, Guid userId)
        {
            ProfileId = profileId;
            UserId = userId;
        }
    }
}