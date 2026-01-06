using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Guides;

public class GuideRating : BaseAuditableEntity
{
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5 stars
    public string? Comment { get; set; }
    public bool IsHelpful { get; set; }
}
