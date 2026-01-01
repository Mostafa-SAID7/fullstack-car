using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Guides;

public class GuideBookmark : BaseAuditableEntity
{
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string? Notes { get; set; }
}