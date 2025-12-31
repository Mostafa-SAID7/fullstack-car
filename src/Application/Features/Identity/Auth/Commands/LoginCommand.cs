using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Admin.Interfaces.Identity.Auth;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Domain.Enums.Identity;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Auth.Commands
{
    public class LoginCommand : IRequest<Result<AuthResponse>>
    {
        public LoginRequest Request { get; set; } = null!;
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponse>>
    {
        private readonly IAuthenticationService _authService;

        public LoginCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<Result<AuthResponse>> Handle(LoginCommand command, CancellationToken cancellationToken)
        {
            return await _authService.LoginAsync(command.Request);
        }
    }
}
