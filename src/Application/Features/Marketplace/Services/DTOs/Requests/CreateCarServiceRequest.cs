using System.ComponentModel.DataAnnotations;
using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Services.DTOs.Requests
{
    public class CreateCarServiceRequest
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        public ServiceType Type { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Base price must be greater than 0")]
        public decimal BasePrice { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Max price must be greater than 0")]
        public decimal? MaxPrice { get; set; }

        [MaxLength(3)]
        public string Currency { get; set; } = "USD";

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Duration must be at least 1 minute")]
        public int EstimatedDurationMinutes { get; set; }

        public bool IsEmergencyService { get; set; } = false;
        public bool IsAvailable24x7 { get; set; } = false;

        [MaxLength(1000)]
        public string? Requirements { get; set; }

        [MaxLength(1000)]
        public string? IncludedItems { get; set; }

        [MaxLength(1000)]
        public string? ExcludedItems { get; set; }

        public List<ServiceAvailabilityRequest>? Availability { get; set; }
    }

    public class ServiceAvailabilityRequest
    {
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string? Notes { get; set; }
    }
}