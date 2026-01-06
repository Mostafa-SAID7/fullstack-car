using Domain.Entities.Identity;

namespace Domain.Entities.Marketplace.Reviews;

public class ReviewHelpfulness : BaseEntity
{
    public Guid ReviewId { get; set; }
    public Guid UserId { get; set; }
    public bool IsHelpful { get; set; } = true;
    public DateTime VotedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ServiceReview Review { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
}
