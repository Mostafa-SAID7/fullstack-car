using Domain.Base;

namespace Domain.Entities.Community
{
    public class Category : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000"; // Hex color code
        public int QuestionCount { get; set; } = 0;
        public int ExpertCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }
}
