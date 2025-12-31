using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace
{
    public class ServiceProvider : BaseAuditableEntity
    {
        public string BusinessName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public bool IsVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public decimal AverageRating { get; set; } = 0;
        public int TotalReviews { get; set; } = 0;
        public string? BusinessLicense { get; set; }
        public string? InsuranceInfo { get; set; }
        public DateTime? VerifiedAt { get; set; }

        // Foreign Keys
        public Guid OwnerId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Owner { get; set; } = null!;
        public virtual ICollection<CarService> Services { get; set; } = new List<CarService>();
        public virtual ICollection<ServiceBooking> Bookings { get; set; } = new List<ServiceBooking>();
        public virtual ICollection<ServiceReview> Reviews { get; set; } = new List<ServiceReview>();
        public virtual ICollection<ServiceProviderSpecialty> Specialties { get; set; } = new List<ServiceProviderSpecialty>();
    }
}