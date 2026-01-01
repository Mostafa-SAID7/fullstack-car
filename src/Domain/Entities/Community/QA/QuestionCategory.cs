using Domain.Base;
using Domain.Enums.Community.QA;

namespace Domain.Entities.Community.QA
{
    public class QuestionCategory : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000";
        public int QuestionsCount { get; set; } = 0;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Foreign Keys
        public Guid? ParentCategoryId { get; set; }

        // Navigation Properties
        public virtual QuestionCategory? ParentCategory { get; set; }
        public virtual ICollection<QuestionCategory> SubCategories { get; set; } = new List<QuestionCategory>();
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}