using Application.Features.Identity.Profile.Interfaces;
using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs.Responses;
using Application.Features.Shared.Interfaces.Caching;
using MediatR;

namespace Application.Features.Identity.Profile.Queries
{
    public class GetProfileQuery : IRequest<Result<UserProfileResponse>>, ICacheableRequest
    {
        public Guid UserId { get; set; }

        public string CacheKey => $"UserProfile_{UserId}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(15);
        public string? CacheTag => $"User_{UserId}";
    }

    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, Result<UserProfileResponse>>
    {
        private readonly IProfileService _profileService;

        public GetProfileQueryHandler(IProfileService profileService)
        {
            _profileService = profileService;
        }

        public async Task<Result<UserProfileResponse>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            return await _profileService.GetProfileAsync(request.UserId.ToString());
        }
    }
}
