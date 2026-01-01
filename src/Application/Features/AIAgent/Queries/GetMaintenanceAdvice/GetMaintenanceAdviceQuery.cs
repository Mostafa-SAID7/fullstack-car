using Application.Common.Interfaces.AIAgent;
using Application.Features.AIAgent.DTOs;
using MediatR;

namespace Application.Features.AIAgent.Queries.GetMaintenanceAdvice
{
    public record GetMaintenanceAdviceQuery(MaintenanceRequestDTO Request) : IRequest<MaintenanceResponseDTO>;

    public class GetMaintenanceAdviceQueryHandler : IRequestHandler<GetMaintenanceAdviceQuery, MaintenanceResponseDTO>
    {
        private readonly IAIAgentService _aiAgentService;

        public GetMaintenanceAdviceQueryHandler(IAIAgentService aiAgentService)
        {
            _aiAgentService = aiAgentService;
        }

        public async Task<MaintenanceResponseDTO> Handle(GetMaintenanceAdviceQuery query, CancellationToken cancellationToken)
        {
            return await _aiAgentService.GetMaintenanceAdviceAsync(query.Request, cancellationToken);
        }
    }
}
