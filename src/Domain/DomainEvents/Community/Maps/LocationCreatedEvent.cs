using Domain.DomainEvents;

namespace Domain.DomainEvents.Community.Maps
{
    public class LocationCreatedEvent : BaseDomainEvent
    {
        public Guid LocationId { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public LocationCreatedEvent(Guid locationId, Guid userId, string name, string city, double latitude, double longitude)
        {
            LocationId = locationId;
            UserId = userId;
            Name = name;
            City = city;
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}