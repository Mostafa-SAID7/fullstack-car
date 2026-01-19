using Domain.Base;

namespace Domain.Entities.Community
{
    public class Tag : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int UsageCount { get; set; } = 0;
        public Guid? CategoryId { get; set; }

        // Navigation Properties
        public virtual Category? Category { get; set; }
        public virtual ICollection<QuestionTag> QuestionTags { get; set; } = new List<QuestionTag>();
    }
}
