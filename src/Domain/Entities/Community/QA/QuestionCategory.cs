using Domain.Base;
using Domain.Entities.Common;

namespace Domain.Entities.Community.QA
{
    public class QuestionCategory : BaseAuditableEntity
    {
        public Guid QuestionId { get; set; }
        public Guid CategoryId { get; set; }

        // Navigation Properties
        public virtual Question Question { get; set; } = null!;
        public virtual Category Category { get; set; } = null!;
    }
}