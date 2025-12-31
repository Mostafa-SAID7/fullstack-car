namespace Application.Features.Shared.Email.Models
{
    public class EmailTemplateResult
    {
        public bool Success { get; set; }
        public string? TemplateId { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}