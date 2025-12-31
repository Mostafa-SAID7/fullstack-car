using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Admin.Interfaces.Identity.Auth;
using Application.Common.Models;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Auth.Commands
{
    public class RegisterCommand : IRequest<Result<AuthResponse>>
    {
        public RegisterRequest Request { get; set; } = null!;
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponse>>
    {
        private readonly IAuthenticationService _authService;

        public RegisterCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<Result<AuthResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            return await _authService.RegisterAsync(command.Request);
        }
    }
}
