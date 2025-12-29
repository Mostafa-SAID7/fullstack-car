using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;
using Application.Common.Interfaces.Identity;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Commands
{
    public class RefreshTokenCommand : IRequest<Result<TokenResponse>>
    {
        public RefreshTokenRequest Request { get; set; } = null!;
    }

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<TokenResponse>>
    {
        private readonly IAuthService _authService;

        public RefreshTokenCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Result<TokenResponse>> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var result = await _authService.RefreshTokenAsync(command.Request.Token, command.Request.RefreshToken);

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
