using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using MediatR;

namespace Application.Features.Identity.Security.Commands
{
    public class EnableTwoFactorCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
    }

    public class EnableTwoFactorCommandHandler : IRequestHandler<EnableTwoFactorCommand, Result>
    {
        private readonly IUserService _userService;

        public EnableTwoFactorCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result> Handle(EnableTwoFactorCommand request, CancellationToken cancellationToken)
        {
            return await _userService.EnableTwoFactorAsync(request.UserId);
        }
    }
}
