using Application.Common.Interfaces.Identity;
using MediatR;

namespace Application.Features.Identity.Security.Queries
{
    public class GetTwoFactorStatusQuery : IRequest<bool>
    {
        public Guid UserId { get; set; }
    }

    public class GetTwoFactorStatusQueryHandler : IRequestHandler<GetTwoFactorStatusQuery, bool>
    {
        private readonly IUserService _userService;

        public GetTwoFactorStatusQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<bool> Handle(GetTwoFactorStatusQuery request, CancellationToken cancellationToken)
        {
            return await _userService.GetTwoFactorStatusAsync(request.UserId);
        }
    }
}
