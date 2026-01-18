using Application.Common.DTOs;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Commands;

public class UpdateUserPreferencesCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public UpdateUserPreferencesRequest Request { get; set; } = new();
}

public class UpdateThemePreferenceCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public UpdateThemePreferenceRequest Request { get; set; } = new();
}

public class UpdateLanguagePreferenceCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public UpdateLanguagePreferenceRequest Request { get; set; } = new();
}

public class UpdateCarInterestsCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public UpdateCarInterestsRequest Request { get; set; } = new();
}

public class ResetUserPreferencesCommand : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
}