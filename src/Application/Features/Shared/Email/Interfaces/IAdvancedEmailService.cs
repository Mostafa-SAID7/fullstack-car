using Application.Features.Shared.Email.Models;

namespace Application.Features.Shared.Email.Interfaces
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
}
