using Application.Features.Identity.Password.Interfaces;
using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
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
        private readonly IPasswordService _passwordService;

        public ChangePasswordCommandHandler(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            return await _passwordService.ChangePasswordAsync(request.UserId.ToString(), request.Request);
        }
    }
}
