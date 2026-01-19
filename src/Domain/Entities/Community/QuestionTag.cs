using Domain.Base;

namespace Domain.Entities.Community
{
    public class QuestionTag : BaseEntity
    {
        // Foreign Keys
        public Guid QuestionId { get; set; }
        public Guid TagId { get; set; }

        // Navigation Properties
        public virtual Question Question { get; set; } = null!;
        public virtual QATag Tag { get; set; } = null!;
    }
}
