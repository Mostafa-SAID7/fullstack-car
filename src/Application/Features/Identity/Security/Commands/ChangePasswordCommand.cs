using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using MediatR;

namespace Application.Features.Identity.Security.Commands
{
    public class ChangePasswordCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
        public ChangePasswordRequest Request { get; set; } = null!;
    }

    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result>
    {
        private readonly IUserService _userService;

        public ChangePasswordCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            return await _userService.ChangePasswordAsync(request.UserId, request.Request);
        }
    }
}
