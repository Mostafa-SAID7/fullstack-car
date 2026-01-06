using Domain.Base;

namespace Domain.Entities.Community.QA
{
    public class QuestionTag : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = "#007bff";
        public int UsageCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
