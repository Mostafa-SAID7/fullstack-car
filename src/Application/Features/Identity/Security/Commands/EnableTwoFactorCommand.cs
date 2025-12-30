using Application.Common.Interfaces.Identity.Security;
using Application.Common.Models;
using MediatR;

namespace Application.Features.Identity.Security.Commands
{
    public class EnableTwoFactorCommand : IRequest<Result>
    {
        public Guid UserId { get; set; }
    }

    public class EnableTwoFactorCommandHandler : IRequestHandler<EnableTwoFactorCommand, Result>
    {
        private readonly ISecurityService _securityService;

        public EnableTwoFactorCommandHandler(ISecurityService securityService)
        {
            _securityService = securityService;
        }

        public async Task<Result> Handle(EnableTwoFactorCommand request, CancellationToken cancellationToken)
        {
            var result = await _securityService.EnableTwoFactorAsync(request.UserId.ToString());
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors);
        }
    }
}
