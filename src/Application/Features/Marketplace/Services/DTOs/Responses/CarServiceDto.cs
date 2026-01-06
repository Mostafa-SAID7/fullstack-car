using Domain.Enums.Marketplace;

namespace Application.Features.Marketplace.Services.DTOs.Responses
{
    public class CarServiceDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ServiceType Type { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public ServiceStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public int EstimatedDurationMinutes { get; set; }
        public string EstimatedDuration { get; set; } = string.Empty;
        public bool IsEmergencyService { get; set; }
        public bool IsAvailable24x7 { get; set; }
        public string? ImageUrl { get; set; }
        public string? Requirements { get; set; }
        public string? IncludedItems { get; set; }
        public string? ExcludedItems { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public int TotalBookings { get; set; }
        public DateTime? LastBookedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ServiceProviderId { get; set; }
        public string ServiceProviderName { get; set; } = string.Empty;
        public List<ServiceAvailabilityDto> Availability { get; set; } = new();
        public List<string> Images { get; set; } = new();
    }

    public class ServiceAvailabilityDto
    {
        public DayOfWeek DayOfWeek { get; set; }
        public string DayName { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; }
        public string? Notes { get; set; }
    }
}
