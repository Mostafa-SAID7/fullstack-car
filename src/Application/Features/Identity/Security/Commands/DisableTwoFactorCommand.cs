using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using MediatR;

namespace Application.Features.Identity.Security.Commands
{
    public class DisableTwoFactorCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
    }

    public class DisableTwoFactorCommandHandler : IRequestHandler<DisableTwoFactorCommand, Result>
    {
        private readonly IUserService _userService;

        public DisableTwoFactorCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result> Handle(DisableTwoFactorCommand request, CancellationToken cancellationToken)
        {
            return await _userService.DisableTwoFactorAsync(request.UserId);
        }
    }
}
