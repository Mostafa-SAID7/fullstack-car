using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Admin.Interfaces.Identity.Auth;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Auth.Commands
{
    public class RefreshTokenCommand : IRequest<Result<TokenResponse>>
    {
        public RefreshTokenRequest Request { get; set; } = null!;
    }

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<TokenResponse>>
    {
        private readonly IAuthenticationService _authService;

        public RefreshTokenCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<Result<TokenResponse>> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var result = await _authService.RefreshTokenAsync(command.Request);

            if (result.Succeeded)
            {
                return Result<TokenResponse>.Success(new TokenResponse
                {
                    Token = result.Data.Token,
                    RefreshToken = result.Data.RefreshToken,
                    ExpiresAt = result.Data.ExpiresAt ?? DateTime.UtcNow.AddHours(1)
                });
            }

            return Result<TokenResponse>.Failure(result.Errors);
        }
    }
}
