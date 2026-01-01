using Domain.Base;
using Domain.Enums.Community.Maps;
using Domain.Entities.Identity;
using Domain.ValueObjects.Community;

namespace Domain.Entities.Community.Maps
{
    public class Location : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public LocationType Type { get; set; }
        public LocationStatus Status { get; set; } = LocationStatus.Active;
        public string? PhoneNumber { get; set; }
        public string? Website { get; set; }
        public string? Email { get; set; }
        public string? ImageUrl { get; set; }
        public decimal AverageRating { get; set; } = 0;
        public int ReviewsCount { get; set; } = 0;
        public int CheckInsCount { get; set; } = 0;
        public string? OpeningHours { get; set; } // JSON format
        public string? Amenities { get; set; } // JSON array
        public bool IsVerified { get; set; } = false;
        public DateTime? VerifiedAt { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; } // User who added the location
        public Guid? CategoryId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual LocationCategory? Category { get; set; }
        public virtual ICollection<PlaceReview> Reviews { get; set; } = new List<PlaceReview>();
        public virtual ICollection<CheckIn> CheckIns { get; set; } = new List<CheckIn>();
        public virtual ICollection<LocationImage> Images { get; set; } = new List<LocationImage>();
        public virtual ICollection<LocationHour> Hours { get; set; } = new List<LocationHour>();
    }
}