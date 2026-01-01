using Domain.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Guides;

public class GuideView : BaseAuditableEntity
{
    public int GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime ViewedAt { get; set; }
    public int TimeSpent { get; set; } // in seconds
    public bool CompletedReading { get; set; }
}