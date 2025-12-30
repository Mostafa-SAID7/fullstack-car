using Application.Features.AIAgent.DTOs;

namespace Application.Common.Interfaces.AIAgent
{
    public interface IAIAgentService
    {
        Task<ChatResponseDTO> ChatAsync(ChatRequestDTO request, CancellationToken cancellationToken = default);
        Task<RecommendationResponseDTO> GetRecommendationsAsync(RecommendationRequestDTO request, CancellationToken cancellationToken = default);
        Task<MaintenanceResponseDTO> GetMaintenanceAdviceAsync(MaintenanceRequestDTO request, CancellationToken cancellationToken = default);
        Task<MarketAnalysisResponseDTO> AnalyzeMarketAsync(MarketAnalysisRequestDTO request, CancellationToken cancellationToken = default);
    }
}
