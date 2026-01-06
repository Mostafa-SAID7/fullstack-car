namespace Application.Features.Shared.Email.Models
{
    public class EmailTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? TextContent { get; set; }
        public string? HtmlContent { get; set; }
        public List<string> RequiredVariables { get; set; } = new();
        public Dictionary<string, object> DefaultValues { get; set; } = new();
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
