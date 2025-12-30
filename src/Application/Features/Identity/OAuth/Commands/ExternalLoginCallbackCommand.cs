using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Common.Interfaces.Identity.Auth;
using MediatR;

namespace Application.Features.Identity.OAuth.Commands
{
    public class ExternalLoginCallbackCommand : IRequest<Result<AuthResponse>>
    {
    }

    public class ExternalLoginCallbackCommandHandler : IRequestHandler<ExternalLoginCallbackCommand, Result<AuthResponse>>
    {
        private readonly IOAuthService _authService;

        public ExternalLoginCallbackCommandHandler(IOAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Result<AuthResponse>> Handle(ExternalLoginCallbackCommand command, CancellationToken cancellationToken)
        {
            return await _authService.ExternalLoginCallBackAsync();
        }
    }
}
