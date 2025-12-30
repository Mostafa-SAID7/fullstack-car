using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
using Application.Common.Interfaces.Identity.Password;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Identity.Password.Commands
{
    public class ResetPasswordCommand : IRequest<Result>
    {
        public ResetPasswordRequest Request { get; set; } = null!;
    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Result>
    {
        private readonly IPasswordService _passwordService;

        public ResetPasswordCommandHandler(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        public async Task<Result> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
        {
            return await _passwordService.ResetPasswordAsync(command.Request);
        }
    }
}
