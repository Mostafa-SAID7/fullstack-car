using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Queries;

public class GetPrivacySettingsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
}

public class GetNotificationSettingsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
}

public class GetUserActivityQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? ActivityType { get; set; }
}

public class GetUserStatsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
}