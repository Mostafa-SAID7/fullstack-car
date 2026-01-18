using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Queries;

public class GetUserPreferencesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
}

public class GetUserCarInterestsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
}