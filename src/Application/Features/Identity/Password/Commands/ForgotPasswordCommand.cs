using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Application.Features.Identity.Password.Interfaces;

namespace Application.Features.Identity.Password.Commands
{
    public class ForgotPasswordCommand : IRequest<Result>
    {
        public ForgotPasswordRequest Request { get; set; } = null!;
    }

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Result>
    {
        private readonly IPasswordService _passwordService;

        public ForgotPasswordCommandHandler(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        public async Task<Result> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            return await _passwordService.ForgotPasswordAsync(command.Request);
        }
    }
}
