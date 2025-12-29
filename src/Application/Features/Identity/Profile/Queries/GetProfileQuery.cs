using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using Application.Features.Identity.DTOs.Responses;
using MediatR;

namespace Application.Features.Identity.Profile.Queries
{
    public class GetProfileQuery : IRequest<Result<UserProfileResponse>>
    {
        public Guid UserId { get; set; }
    }

    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, Result<UserProfileResponse>>
    {
        private readonly IUserService _userService;

        public GetProfileQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result<UserProfileResponse>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            return await _userService.GetProfileAsync(request.UserId);
        }
    }
}
