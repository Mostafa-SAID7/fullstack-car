using Application.Common.Interfaces.Identity.Security;
using Application.Common.Models;
using Application.Features.Identity.Security.DTOs.Requests;
using MediatR;

namespace Application.Features.Identity.Security.Commands
{
    public class DisableTwoFactorCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
    }

    public class DisableTwoFactorCommandHandler : IRequestHandler<DisableTwoFactorCommand, Result>
    {
        private readonly ISecurityService _securityService;

        public DisableTwoFactorCommandHandler(ISecurityService securityService)
        {
            _securityService = securityService;
        }

        public async Task<Result> Handle(DisableTwoFactorCommand request, CancellationToken cancellationToken)
        {
            return await _securityService.DisableTwoFactorAsync(request.UserId.ToString(), new DisableTwoFactorRequest());
        }
    }
}
