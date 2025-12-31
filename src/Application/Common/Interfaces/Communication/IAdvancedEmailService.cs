namespace Application.Common.Interfaces.Communication
{
    public interface IAdvancedEmailService
    {
        Task<EmailResult> SendEmailAsync(EmailMessage message, CancellationToken cancellationToken = default);
        Task<EmailResult> SendTemplatedEmailAsync(string templateName, object model, string to, string? subject = null, CancellationToken cancellationToken = default);
        Task<BulkEmailResult> SendBulkEmailAsync(BulkEmailMessage message, CancellationToken cancellationToken = default);
        Task<EmailResult> SendEmailWithAttachmentsAsync(EmailMessage message, IEnumerable<EmailAttachment> attachments, CancellationToken cancellationToken = default);
        Task<EmailTemplateResult> CreateEmailTemplateAsync(EmailTemplate template, CancellationToken cancellationToken = default);
        Task<EmailTemplateResult> UpdateEmailTemplateAsync(string templateId, EmailTemplate template, CancellationToken cancellationToken = default);
        Task<bool> DeleteEmailTemplateAsync(string templateId, CancellationToken cancellationToken = default);
        Task<EmailTemplate?> GetEmailTemplateAsync(string templateId, CancellationToken cancellationToken = default);
        Task<List<EmailTemplate>> GetEmailTemplatesAsync(CancellationToken cancellationToken = default);
        Task<EmailDeliveryStatus> GetEmailStatusAsync(string messageId, CancellationToken cancellationToken = default);
        Task<List<EmailDeliveryStatus>> GetBulkEmailStatusAsync(string bulkId, CancellationToken cancellationToken = default);
    }

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

    public class EmailRecipient
    {
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public Dictionary<string, object> MergeData { get; set; } = new();
    }

    public class EmailAttachment
    {
        public string FileName { get; set; } = string.Empty;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string ContentType { get; set; } = "application/octet-stream";
        public string? ContentId { get; set; }
        public bool IsInline { get; set; } = false;
    }

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

    public class EmailResult
    {
        public bool Success { get; set; }
        public string? MessageId { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
        public DateTime SentAt { get; set; }
    }

    public class BulkEmailResult
    {
        public bool Success { get; set; }
        public string? BulkId { get; set; }
        public int TotalRecipients { get; set; }
        public int SuccessfulSends { get; set; }
        public int FailedSends { get; set; }
        public List<EmailError> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
        public DateTime SentAt { get; set; }
    }

    public class EmailTemplateResult
    {
        public bool Success { get; set; }
        public string? TemplateId { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    public class EmailDeliveryStatus
    {
        public string MessageId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Recipient { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public DateTime? OpenedAt { get; set; }
        public DateTime? ClickedAt { get; set; }
        public DateTime? BouncedAt { get; set; }
        public string? BounceReason { get; set; }
        public List<EmailEvent> Events { get; set; } = new();
    }

    public class EmailError
    {
        public string Recipient { get; set; } = string.Empty;
        public string Error { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class EmailEvent
    {
        public string Type { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Dictionary<string, object> Data { get; set; } = new();
    }

    public enum EmailPriority
    {
        Low,
        Normal,
        High,
        Urgent
    }
}