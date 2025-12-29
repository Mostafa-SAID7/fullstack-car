using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;
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
        private readonly IUserService _userService;

        public UpdateProfileCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result<UserProfileResponse>> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            return await _userService.UpdateProfileAsync(request.UserId, request.Request);
        }
    }
}
