using System.ComponentModel.DataAnnotations;

namespace Application.Features.Marketplace.ServiceProviders.DTOs.Requests
{
    public class UpdateServiceProviderRequest
    {
        [Required]
        [MaxLength(200)]
        public string BusinessName { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(254)]
        public string ContactEmail { get; set; } = string.Empty;

        [Phone]
        [MaxLength(20)]
        public string? ContactPhone { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? State { get; set; }

        [MaxLength(20)]
        public string? ZipCode { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Url]
        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }

        [MaxLength(100)]
        public string? BusinessLicense { get; set; }

        [MaxLength(500)]
        public string? InsuranceInfo { get; set; }

        public bool IsActive { get; set; } = true;
    }
}