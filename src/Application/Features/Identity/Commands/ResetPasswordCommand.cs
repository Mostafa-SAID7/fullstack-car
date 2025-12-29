using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Application.Common.Interfaces.Identity;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Identity.Commands
{
    public class ResetPasswordCommand : IRequest<Result>
    {
        public ResetPasswordRequest Request { get; set; } = null!;
    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Result>
    {
        private readonly IUserService _userService;

        public ResetPasswordCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
        {
            return await _userService.ResetPasswordAsync(command.Request);
        }
    }
}
