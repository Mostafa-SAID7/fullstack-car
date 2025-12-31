namespace Application.Features.Marketplace.ServiceProviders.DTOs.Responses
{
    public class ServiceProviderDto
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string ContactEmail { get; set; } = string.Empty;
        public string? ContactPhone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public bool IsVerified { get; set; }
        public bool IsActive { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public string? BusinessLicense { get; set; }
        public string? InsuranceInfo { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public int TotalServices { get; set; }
        public int TotalBookings { get; set; }
    }
}