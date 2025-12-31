using Application.Features.AIAgent.Interfaces;
using Application.Features.AIAgent.DTOs;
using MediatR;

namespace Application.Features.AIAgent.Queries.AnalyzeMarket
{
    public record AnalyzeMarketQuery(MarketAnalysisRequestDTO Request) : IRequest<MarketAnalysisResponseDTO>;

    public class AnalyzeMarketQueryHandler : IRequestHandler<AnalyzeMarketQuery, MarketAnalysisResponseDTO>
    {
        private readonly IAIAgentService _aiAgentService;

        public AnalyzeMarketQueryHandler(IAIAgentService aiAgentService)
        {
            _aiAgentService = aiAgentService;
        }

        public async Task<MarketAnalysisResponseDTO> Handle(AnalyzeMarketQuery query, CancellationToken cancellationToken)
        {
            return await _aiAgentService.AnalyzeMarketAsync(query.Request, cancellationToken);
        }
    }
}
