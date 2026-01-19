using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Common;

namespace Domain.Entities.Common
{
    public class UserActivity : BaseEntity
    {
        public string ActivityType { get; set; } = string.Empty; // e.g., "QuestionAsked", "AnswerGiven", "PostCreated"
        
        // Optional content reference
        public Domain.Enums.Common.ContentType? ContentType { get; set; }
        public Guid? ContentId { get; set; }
        
        public string? Category { get; set; }
        public int ReputationChange { get; set; } = 0;
        public string? AdditionalInfo { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
