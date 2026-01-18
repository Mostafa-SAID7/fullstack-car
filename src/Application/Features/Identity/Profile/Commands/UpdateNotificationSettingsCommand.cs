using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Commands;

public class UpdateNotificationSettingsCommand : IRequest<Result<NotificationSettingsDto>>
{
    public Guid UserId { get; set; }
    public UpdateNotificationSettingsRequest Request { get; set; } = default!;
}

public class UpdateNotificationSettingsCommandHandler : IRequestHandler<UpdateNotificationSettingsCommand, Result<NotificationSettingsDto>>
{
    public async Task<Result<NotificationSettingsDto>> Handle(UpdateNotificationSettingsCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement notification settings update logic
        await Task.CompletedTask;
        
        var settings = new NotificationSettingsDto
        {
            EmailNotifications = request.Request.EmailNotifications,
            PushNotifications = request.Request.PushNotifications,
            SmsNotifications = request.Request.SmsNotifications
        };
        
        return Result<NotificationSettingsDto>.Success(settings);
    }
}