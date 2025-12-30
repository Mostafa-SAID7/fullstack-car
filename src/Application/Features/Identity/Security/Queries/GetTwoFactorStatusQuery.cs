using Application.Common.Interfaces.Identity.Security;
using MediatR;

namespace Application.Features.Identity.Security.Queries
{
    public class GetTwoFactorStatusQuery : IRequest<bool>
    {
        public Guid UserId { get; set; }
    }

    public class GetTwoFactorStatusQueryHandler : IRequestHandler<GetTwoFactorStatusQuery, bool>
    {
        private readonly ISecurityService _securityService;

        public GetTwoFactorStatusQueryHandler(ISecurityService securityService)
        {
            _securityService = securityService;
        }

        public async Task<bool> Handle(GetTwoFactorStatusQuery request, CancellationToken cancellationToken)
        {
            var result = await _securityService.GetTwoFactorStatusAsync(request.UserId.ToString());
            return result.Succeeded ? result.Data : false;
        }
    }
}
