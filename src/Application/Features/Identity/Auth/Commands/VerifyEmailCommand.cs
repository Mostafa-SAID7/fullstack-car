using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Requests;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Application.Common.Interfaces.Identity.Auth;

namespace Application.Features.Identity.Auth.Commands
{
    public class VerifyEmailCommand : IRequest<Result>
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Result>
    {
        private readonly IAuthenticationService _authService;

        public VerifyEmailCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<Result> Handle(VerifyEmailCommand command, CancellationToken cancellationToken)
        {
            return await _authService.ConfirmEmailAsync(new ConfirmEmailRequest 
            { 
                Email = command.Email, 
                Token = command.Token 
            });
        }
    }
}
