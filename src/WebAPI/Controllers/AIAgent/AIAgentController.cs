using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using MediatR;
using Application.Features.AIAgent.DTOs;
using Application.Features.AIAgent.Commands.ChatWithAgent;
using Application.Features.AIAgent.Queries.GetCarRecommendations;
using Application.Features.AIAgent.Queries.GetMaintenanceAdvice;
using Application.Features.AIAgent.Queries.AnalyzeMarket;

namespace WebAPI.Controllers.AIAgent
{
    [Authorize]
    [ApiVersion("5.0")]
    [Route("api/v{version:apiVersion}/ai-agent")]
    public class AIAgentController : BaseController
    {
        private readonly ISender _sender;
        private readonly ILogger<AIAgentController> _logger;

        public AIAgentController(ISender sender, ILogger<AIAgentController> logger)
        {
            _sender = sender;
            _logger = logger;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDTO request)
        {
            var result = await _sender.Send(new ChatWithAgentCommand(request));
            return Ok(result);
        }

        [HttpPost("recommendations")]
        public async Task<IActionResult> GetRecommendations([FromBody] RecommendationRequestDTO request)
        {
            var result = await _sender.Send(new GetCarRecommendationsQuery(request));
            return Ok(result);
        }

        [HttpPost("maintenance/advice")]
        public async Task<IActionResult> GetMaintenanceAdvice([FromBody] MaintenanceRequestDTO request)
        {
            var result = await _sender.Send(new GetMaintenanceAdviceQuery(request));
            return Ok(result);
        }

        [HttpPost("analysis/market")]
        public async Task<IActionResult> AnalyzeMarket([FromBody] MarketAnalysisRequestDTO request)
        {
            var result = await _sender.Send(new AnalyzeMarketQuery(request));
            return Ok(result);
        }
    }
}