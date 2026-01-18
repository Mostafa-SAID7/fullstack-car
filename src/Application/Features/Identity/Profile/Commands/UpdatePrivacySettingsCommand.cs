using Application.Common.DTOs;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Commands;

public class UpdatePrivacySettingsCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public UpdatePrivacySettingsRequest Request { get; set; } = new();
}

public class UpdateNotificationSettingsCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public UpdateNotificationSettingsRequest Request { get; set; } = new();
}

public class DeactivateAccountCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public DeactivateAccountRequest Request { get; set; } = new();
}