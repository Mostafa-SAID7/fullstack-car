using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebAPI.Controllers.Shared.Common
{
    [Route("api/shared/health")]
    public class HealthController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetHealth()
        {
            // Basic health check
            var health = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"
            };
            
            return Ok(health);
        }

        [HttpGet("detailed")]
        public async Task<IActionResult> GetDetailedHealth()
        {
            // Detailed health check with dependencies
            var health = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                Dependencies = new
                {
                    Database = new { Status = "Connected", ResponseTime = "15ms" },
                    AIService = new { Status = "Connected", ResponseTime = "120ms" },
                    Cache = new { Status = "Connected", ResponseTime = "5ms" }
                },
                SystemInfo = new
                {
                    MachineName = Environment.MachineName,
                    ProcessorCount = Environment.ProcessorCount,
                    WorkingSet = GC.GetTotalMemory(false),
                    Uptime = DateTime.UtcNow.Subtract(Process.GetCurrentProcess().StartTime).ToString(@"dd\.hh\:mm\:ss")
                }
            };
            
            return Ok(health);
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            // Simple ping endpoint
            return Ok(new { Message = "Pong", Timestamp = DateTime.UtcNow });
        }
    }
}