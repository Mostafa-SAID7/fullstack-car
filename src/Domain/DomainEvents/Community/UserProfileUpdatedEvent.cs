using Domain.DomainEvents;
using Domain.ValueObjects.Community.Social;

namespace Domain.DomainEvents.Community
{
    public class UserProfileUpdatedEvent : BaseDomainEvent
    {
        public Guid ProfileId { get; }
        public Guid UserId { get; }
        public ProfileInformation OldProfileInfo { get; }
        public ProfileInformation NewProfileInfo { get; }

        public UserProfileUpdatedEvent(
            Guid profileId, 
            Guid userId, 
            ProfileInformation oldProfileInfo, 
            ProfileInformation newProfileInfo)
        {
            ProfileId = profileId;
            UserId = userId;
            OldProfileInfo = oldProfileInfo;
            NewProfileInfo = newProfileInfo;
        }
    }
}