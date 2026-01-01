using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Guides;

public class GuideView : BaseAuditableEntity
{
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime ViewedAt { get; set; }
    public int TimeSpent { get; set; } // in seconds
    public bool CompletedReading { get; set; }
}