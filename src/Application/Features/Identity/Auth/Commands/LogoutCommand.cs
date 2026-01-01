using Application.Common.Models;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Application.Features.Identity.Auth.Interfaces;

namespace Application.Features.Identity.Auth.Commands
{
    public class LogoutCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
    }

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result>
    {
        private readonly IAuthenticationService _authService;

        public LogoutCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<Result> Handle(LogoutCommand command, CancellationToken cancellationToken)
        {
            return await _authService.LogoutAsync(command.UserId.ToString());
        }
    }
}
