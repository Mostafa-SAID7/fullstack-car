using Domain.Base;

namespace Domain.Entities.Community.QA
{
    public class QACategory : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000"; // Hex color code
        public int QuestionCount { get; set; } = 0;
        public int ExpertCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ICollection<QAExpert> Experts { get; set; } = new List<QAExpert>();
        public virtual ICollection<QATag> Tags { get; set; } = new List<QATag>();
    }
}