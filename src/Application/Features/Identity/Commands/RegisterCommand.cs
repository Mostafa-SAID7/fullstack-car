using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;
using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Commands
{
    public class RegisterCommand : IRequest<Result<AuthResponse>>
    {
        public RegisterRequest Request { get; set; } = null!;
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponse>>
    {
        private readonly IAuthService _authService;

        public RegisterCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Result<AuthResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            return await _authService.RegisterAsync(command.Request);
        }
    }
}
