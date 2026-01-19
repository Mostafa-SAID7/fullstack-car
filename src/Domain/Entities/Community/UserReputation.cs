using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class UserReputation : BaseAuditableEntity
    {
        public int ReputationScore { get; set; } = 0;
        public int QuestionsAsked { get; set; } = 0;
        public int AnswersGiven { get; set; } = 0;
        public int AcceptedAnswers { get; set; } = 0;
        public int UpvotesReceived { get; set; } = 0;
        public int DownvotesReceived { get; set; } = 0;
        public string? BadgesEarned { get; set; } // JSON array of badges
        public string? ExpertiseAreas { get; set; } // JSON array of expertise areas
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
