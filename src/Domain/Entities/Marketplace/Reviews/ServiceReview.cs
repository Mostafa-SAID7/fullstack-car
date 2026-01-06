using Domain.Entities.Identity;

using Domain.Entities.Marketplace.Bookings;
using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Providers;
using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace.Reviews;

public class ServiceReview : BaseEntity
{
    public Guid BookingId { get; set; }
    public Guid ServiceId { get; set; }
    public Guid ServiceProviderId { get; set; }
    public Guid CustomerId { get; set; }
    public int OverallRating { get; set; } // 1-5 stars
    public int? QualityRating { get; set; }
    public int? TimelinessRating { get; set; }
    public int? CommunicationRating { get; set; }
    public int? ValueRating { get; set; }
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public string? Pros { get; set; }
    public string? Cons { get; set; }
    public bool IsRecommended { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    public bool IsPublic { get; set; } = true;
    public bool IsAnonymous { get; set; } = false;
    public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
    public string? ReviewerName { get; set; }
    public string? ReviewerLocation { get; set; }
    public bool WouldUseAgain { get; set; } = true;
    public string? ServiceUsedFor { get; set; }
    public int HelpfulVotes { get; set; } = 0;
    public int UnhelpfulVotes { get; set; } = 0;

    // Provider Response
    public string? ProviderResponse { get; set; }
    public DateTime? ProviderResponseDate { get; set; }
    public Guid? ProviderResponseByUserId { get; set; }

    // Moderation
    public bool IsFlagged { get; set; } = false;
    public string? FlagReason { get; set; }
    public bool IsApproved { get; set; } = true;
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedByUserId { get; set; }

    // Additional properties expected by Infrastructure
    public int Rating { get; set; } // Alias for OverallRating
    public Guid ReviewerId { get; set; } // Alias for CustomerId

    // Navigation properties
    public ServiceBooking Booking { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public ServiceProvider ServiceProvider { get; set; } = null!;
    public ApplicationUser Customer { get; set; } = null!;
    public ApplicationUser? ProviderResponseByUser { get; set; }
    public ApplicationUser? ApprovedByUser { get; set; }
    public ICollection<ReviewAttachment> Attachments { get; set; } = new List<ReviewAttachment>();
    public ICollection<ReviewHelpfulness> HelpfulnessVotes { get; set; } = new List<ReviewHelpfulness>();
}
