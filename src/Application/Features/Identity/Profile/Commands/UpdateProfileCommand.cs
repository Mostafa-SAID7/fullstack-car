using Application.Common.Interfaces.Identity.Profile;
using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs.Requests;
using Application.Features.Identity.Profile.DTOs.Responses;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Identity.Profile.Commands
{
    public class UpdateProfileCommand : IRequest<Result<UserProfileResponse>>
    {
        public Guid UserId { get; set; }
        public UpdateProfileRequest Request { get; set; } = null!;
    }

    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, Result<UserProfileResponse>>
    {
        private readonly IProfileService _profileService;
        private readonly ICacheService _cacheService;

        public UpdateProfileCommandHandler(IProfileService profileService, ICacheService cacheService)
        {
            _profileService = profileService;
            _cacheService = cacheService;
        }

        public async Task<Result<UserProfileResponse>> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var result = await _profileService.UpdateProfileAsync(request.UserId.ToString(), request.Request);

            if (result.Succeeded)
            {
                await _cacheService.RemoveByTagAsync($"User_{request.UserId}", cancellationToken);
            }

            return result;
        }
    }
}
