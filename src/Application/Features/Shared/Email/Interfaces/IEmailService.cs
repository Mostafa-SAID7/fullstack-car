namespace Application.Features.Shared.Email.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken);
        Task SendEmailWithTemplateAsync(string to, string templateName, object model);
        Task SendEmailWithTemplateAsync(string to, string templateName, object model, CancellationToken cancellationToken);
        Task SendBulkEmailAsync(IEnumerable<string> recipients, string subject, string body);
        Task SendBulkEmailAsync(IEnumerable<string> recipients, string subject, string body, CancellationToken cancellationToken);

        Task SendPasswordResetEmailAsync(string to, string token);
        Task SendEmailConfirmationAsync(string to, string token);
    }
}