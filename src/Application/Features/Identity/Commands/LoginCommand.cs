using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;
using Application.Common.Interfaces.Identity;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Domain.Enums;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Commands
{
    public class LoginCommand : IRequest<Result<AuthResponse>>
    {
        public LoginRequest Request { get; set; } = null!;
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponse>>
    {
        private readonly IAuthService _authService;

        public LoginCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Result<AuthResponse>> Handle(LoginCommand command, CancellationToken cancellationToken)
        {
            return await _authService.LoginAsync(command.Request);
        }
    }
}
