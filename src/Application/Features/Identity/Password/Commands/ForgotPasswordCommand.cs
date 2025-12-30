using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Application.Common.Interfaces.Identity;

namespace Application.Features.Identity.Password.Commands
{
    public class ForgotPasswordCommand : IRequest<Result>
    {
        public ForgotPasswordRequest Request { get; set; } = null!;
    }

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Result>
    {
        private readonly IUserService _userService;

        public ForgotPasswordCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            return await _userService.ForgotPasswordAsync(command.Request.Email);
        }
    }
}
