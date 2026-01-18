using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Queries;

public class GetNotificationSettingsQuery : IRequest<Result<NotificationSettingsDto>>
{
    public Guid UserId { get; set; }
}

public class NotificationSettingsDto
{
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool SmsNotifications { get; set; }
    public bool MarketingEmails { get; set; }
    public bool WeeklyDigest { get; set; }
}

public class GetNotificationSettingsQueryHandler : IRequestHandler<GetNotificationSettingsQuery, Result<NotificationSettingsDto>>
{
    public async Task<Result<NotificationSettingsDto>> Handle(GetNotificationSettingsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement notification settings retrieval logic
        await Task.CompletedTask;
        
        var settings = new NotificationSettingsDto
        {
            EmailNotifications = true,
            PushNotifications = true,
            SmsNotifications = false,
            MarketingEmails = false,
            WeeklyDigest = true
        };
        
        return Result<NotificationSettingsDto>.Success(settings);
    }
}