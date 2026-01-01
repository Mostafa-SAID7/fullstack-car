using Domain.Entities.Identity;

namespace Domain.Entities.Marketplace.Services;

public class CarService : Service
{
    public string? VehicleTypes { get; set; } // JSON array of supported vehicle types
    public string? SupportedBrands { get; set; } // JSON array of car brands
    public bool IsMobileService { get; set; } = false;
    public bool RequiresSpecialEquipment { get; set; } = false;
    public string? SpecialEquipmentDetails { get; set; }
    public bool IsEmergencyService { get; set; } = false;
    public decimal? EmergencyPriceMultiplier { get; set; }
    public string? ServiceLocation { get; set; } // Shop, Mobile, Both
    public int? MaxVehicleAge { get; set; }
    public string? WarrantyPeriod { get; set; }
    public bool RequiresAppointment { get; set; } = true;
    
    // Additional properties expected by Application layer
    public string Currency { get; set; } = "USD";
    public int EstimatedDurationMinutes { get; set; }
    public bool IsAvailable24x7 { get; set; } = false;
    public string? IncludedItems { get; set; }
    public string? ExcludedItems { get; set; }
    public DateTime? LastBookedAt { get; set; }
    
    // Additional properties expected by Infrastructure
    public string? ImageUrl { get; set; }
    public ICollection<ServiceAvailability> Availability { get; set; } = new List<ServiceAvailability>();
}