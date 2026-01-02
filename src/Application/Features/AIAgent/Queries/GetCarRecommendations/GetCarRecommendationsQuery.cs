using Application.Features.AIAgent.Interfaces;
using Application.Features.AIAgent.DTOs;
using MediatR;

namespace Application.Features.AIAgent.Queries.GetCarRecommendations
{
    public record GetCarRecommendationsQuery(RecommendationRequestDTO Request) : IRequest<RecommendationResponseDTO>;

    public class GetCarRecommendationsQueryHandler : IRequestHandler<GetCarRecommendationsQuery, RecommendationResponseDTO>
    {
        private readonly IAIAgentService _aiAgentService;

        public GetCarRecommendationsQueryHandler(IAIAgentService aiAgentService)
        {
            _aiAgentService = aiAgentService;
        }

        public async Task<RecommendationResponseDTO> Handle(GetCarRecommendationsQuery query, CancellationToken cancellationToken)
        {
            return await _aiAgentService.GetRecommendationsAsync(query.Request, cancellationToken);
        }
    }
}
