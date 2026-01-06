namespace Application.Features.Shared.Email.Models
{
    public class EmailMessage
    {
        public string To { get; set; } = string.Empty;
        public string? ToName { get; set; }
        public List<string> Cc { get; set; } = new();
        public List<string> Bcc { get; set; } = new();
        public string Subject { get; set; } = string.Empty;
        public string? TextContent { get; set; }
        public string? HtmlContent { get; set; }
        public string? From { get; set; }
        public string? FromName { get; set; }
        public string? ReplyTo { get; set; }
        public Dictionary<string, string> Headers { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
        public EmailPriority Priority { get; set; } = EmailPriority.Normal;
        public DateTime? ScheduledAt { get; set; }
    }
}
