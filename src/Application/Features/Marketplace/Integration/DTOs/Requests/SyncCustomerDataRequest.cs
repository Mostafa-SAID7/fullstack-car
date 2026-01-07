using System.ComponentModel.DataAnnotations;

namespace Application.Features.Marketplace.Integration.DTOs.Requests;

public class SyncCustomerDataRequest
{
    public string[]? CustomerIds { get; set; }
    
    [Required]
    public string SyncType { get; set; } = string.Empty; // Full, Incremental, Selective
    
    public bool SyncOrders { get; set; } = true;
    public bool SyncPreferences { get; set; } = true;
    public bool SyncLoyaltyPoints { get; set; } = true;
    public bool SyncInteractions { get; set; } = true;
    
    public DateTime? LastSyncDate { get; set; }
    
    public string? Notes { get; set; }
}