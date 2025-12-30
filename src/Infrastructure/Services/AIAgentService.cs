using Application.Common.Interfaces.AIAgent;
using Application.Features.AIAgent.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class AIAgentService : IAIAgentService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIAgentService> _logger;
        private readonly string _baseUrl;

        public AIAgentService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<AIAgentService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _baseUrl = _configuration["AIAgent:PythonServiceUrl"] ?? "http://localhost:8000";
        }

        public async Task<ChatResponseDTO> ChatAsync(ChatRequestDTO request, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/chat", request, cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<ChatResponseDTO>(cancellationToken: cancellationToken) 
                    ?? new ChatResponseDTO { Message = "Error: Invalid response from AI service." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AI chat service at {Url}", $"{_baseUrl}/api/chat");
                return new ChatResponseDTO { Message = "AI service is currently unavailable. Please try again later.", Timestamp = DateTime.UtcNow };
            }
        }

        public async Task<RecommendationResponseDTO> GetRecommendationsAsync(RecommendationRequestDTO request, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/recommendations", request, cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<RecommendationResponseDTO>(cancellationToken: cancellationToken) 
                    ?? new RecommendationResponseDTO();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting car recommendations from AI service");
                return new RecommendationResponseDTO();
            }
        }

        public async Task<MaintenanceResponseDTO> GetMaintenanceAdviceAsync(MaintenanceRequestDTO request, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/maintenance/advice", request, cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<MaintenanceResponseDTO>(cancellationToken: cancellationToken) 
                    ?? new MaintenanceResponseDTO { Recommendations = "Error: Invalid response from AI service." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting maintenance advice from AI service");
                return new MaintenanceResponseDTO { Recommendations = "Maintenance service is currently unavailable." };
            }
        }

        public async Task<MarketAnalysisResponseDTO> AnalyzeMarketAsync(MarketAnalysisRequestDTO request, CancellationToken cancellationToken = default)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/analysis/market", request, cancellationToken);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<MarketAnalysisResponseDTO>(cancellationToken: cancellationToken) 
                    ?? new MarketAnalysisResponseDTO { Analysis = "Error: Invalid response from AI service." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing market via AI service");
                return new MarketAnalysisResponseDTO { Analysis = "Market analysis service is currently unavailable." };
            }
        }
    }
}
