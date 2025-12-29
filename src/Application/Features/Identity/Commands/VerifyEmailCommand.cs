using Application.Common.Models;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Application.Common.Interfaces.Identity;

namespace Application.Features.Identity.Commands
{
    public class VerifyEmailCommand : IRequest<Result>
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Result>
    {
        private readonly IUserService _userService;

        public VerifyEmailCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result> Handle(VerifyEmailCommand command, CancellationToken cancellationToken)
        {
            return await _userService.VerifyEmailAsync(command.Email, command.Token);
        }
    }
}
