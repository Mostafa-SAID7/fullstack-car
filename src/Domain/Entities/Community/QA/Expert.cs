using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.QA
{
    public class Expert : BaseAuditableEntity
    {
        public string ExpertiseArea { get; set; } = string.Empty; // The area of expertise (category name)
        public string ExpertiseLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Expert, Master
        public int AnswerCount { get; set; } = 0;
        public int AcceptedAnswerCount { get; set; } = 0;
        public decimal AverageRating { get; set; } = 0;
        public decimal ResponseRate { get; set; } = 0; // Percentage
        public bool NotificationEnabled { get; set; } = true;

        // Foreign Keys
        public Guid UserId { get; set; }
        public Guid CategoryId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Domain.Entities.Common.Category Category { get; set; } = null!;
    }
}