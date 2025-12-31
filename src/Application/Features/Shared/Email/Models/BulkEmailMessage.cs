namespace Application.Features.Shared.Email.Models
{
    public class BulkEmailMessage
    {
        public List<EmailRecipient> Recipients { get; set; } = new();
        public string Subject { get; set; } = string.Empty;
        public string? TextContent { get; set; }
        public string? HtmlContent { get; set; }
        public string? TemplateId { get; set; }
        public string? From { get; set; }
        public string? FromName { get; set; }
        public string? ReplyTo { get; set; }
        public Dictionary<string, string> Headers { get; set; } = new();
        public Dictionary<string, object> GlobalMergeData { get; set; } = new();
        public EmailPriority Priority { get; set; } = EmailPriority.Normal;
        public DateTime? ScheduledAt { get; set; }
        public int BatchSize { get; set; } = 100;
    }
}