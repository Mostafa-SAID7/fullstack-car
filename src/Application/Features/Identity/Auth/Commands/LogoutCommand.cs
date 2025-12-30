using Application.Common.Models;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Application.Common.Interfaces.Identity;

namespace Application.Features.Identity.Auth.Commands
{
    public class LogoutCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
    }

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result>
    {
        private readonly IAuthService _authService;

        public LogoutCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Result> Handle(LogoutCommand command, CancellationToken cancellationToken)
        {
            return await _authService.LogoutAsync(command.UserId);
        }
    }
}
