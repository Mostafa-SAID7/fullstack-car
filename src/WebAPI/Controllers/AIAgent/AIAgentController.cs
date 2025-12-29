using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using Asp.Versioning;

namespace WebAPI.Controllers.AIAgent
{
    [Authorize]
    [ApiVersion("5.0")]
    [Route("api/v{version:apiVersion}/ai-agent")]
    public class AIAgentController : BaseController
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIAgentController> _logger;

        public AIAgentController(
            HttpClient httpClient, 
            IConfiguration configuration,
            ILogger<AIAgentController> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            try
            {
                var aiServiceUrl = _configuration["AIAgent:PythonServiceUrl"];
                var response = await _httpClient.PostAsync(
                    $"{aiServiceUrl}/api/chat",
                    new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
                );

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(JsonSerializer.Deserialize<object>(content));
                }

                return BadRequest("Failed to get AI response");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error communicating with AI service");
                return StatusCode(500, "AI service unavailable");
            }
        }

        [HttpPost("recommendations")]
        public async Task<IActionResult> GetRecommendations([FromBody] CarPreferencesRequest request)
        {
            try
            {
                var aiServiceUrl = _configuration["AIAgent:PythonServiceUrl"];
                var response = await _httpClient.PostAsync(
                    $"{aiServiceUrl}/api/recommendations",
                    new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
                );

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(JsonSerializer.Deserialize<object>(content));
                }

                return BadRequest("Failed to get recommendations");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting car recommendations");
                return StatusCode(500, "Recommendation service unavailable");
            }
        }

        [HttpPost("maintenance/advice")]
        public async Task<IActionResult> GetMaintenanceAdvice([FromBody] CarInfoRequest request)
        {
            try
            {
                var aiServiceUrl = _configuration["AIAgent:PythonServiceUrl"];
                var response = await _httpClient.PostAsync(
                    $"{aiServiceUrl}/api/maintenance/advice",
                    new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
                );

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(JsonSerializer.Deserialize<object>(content));
                }

                return BadRequest("Failed to get maintenance advice");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting maintenance advice");
                return StatusCode(500, "Maintenance service unavailable");
            }
        }

        [HttpPost("analysis/market")]
        public async Task<IActionResult> AnalyzeMarket([FromBody] MarketAnalysisRequest request)
        {
            try
            {
                var aiServiceUrl = _configuration["AIAgent:PythonServiceUrl"];
                var response = await _httpClient.PostAsync(
                    $"{aiServiceUrl}/api/analysis/market",
                    new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
                );

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(JsonSerializer.Deserialize<object>(content));
                }

                return BadRequest("Failed to analyze market");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing market");
                return StatusCode(500, "Market analysis service unavailable");
            }
        }
    }

    // Request DTOs
    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
        public string? Context { get; set; }
        public string? UserId { get; set; }
    }

    public class CarPreferencesRequest
    {
        public string? Budget { get; set; }
        public string? CarType { get; set; }
        public string? FuelType { get; set; }
        public string? Usage { get; set; }
        public List<string>? Features { get; set; }
    }

    public class CarInfoRequest
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int? Mileage { get; set; }
        public string? LastService { get; set; }
        public List<string>? ServiceHistory { get; set; }
    }

    public class MarketAnalysisRequest
    {
        public string CarQuery { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? TimeFrame { get; set; }
    }
}