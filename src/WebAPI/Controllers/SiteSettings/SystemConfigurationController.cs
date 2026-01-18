using Application.Features.Admin.SystemConfiguration.Commands;
using Application.Features.Admin.SystemConfiguration.DTOs;
using Application.Features.Admin.SystemConfiguration.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/system-configuration")]
    public class SystemConfigurationController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public SystemConfigurationController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "SystemConfiguration" })]
        public async Task<IActionResult> GetSystemConfiguration()
        {
            var query = new GetSystemConfigurationQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "System configuration retrieved successfully");

            return BadRequest("Failed to retrieve system configuration", result.Errors);
        }

        [HttpPut("database")]
        public async Task<IActionResult> UpdateDatabaseConfiguration([FromBody] UpdateDatabaseConfigurationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateDatabaseConfigurationCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Database configuration updated successfully");

            return BadRequest("Failed to update database configuration", result.Errors);
        }

        [HttpPut("cache")]
        public async Task<IActionResult> UpdateCacheConfiguration([FromBody] UpdateCacheConfigurationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateCacheConfigurationCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Cache configuration updated successfully");

            return BadRequest("Failed to update cache configuration", result.Errors);
        }

        [HttpPut("logging")]
        public async Task<IActionResult> UpdateLoggingConfiguration([FromBody] UpdateLoggingConfigurationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateLoggingConfigurationCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Logging configuration updated successfully");

            return BadRequest("Failed to update logging configuration", result.Errors);
        }

        [HttpPut("performance")]
        public async Task<IActionResult> UpdatePerformanceConfiguration([FromBody] UpdatePerformanceConfigurationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdatePerformanceConfigurationCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Performance configuration updated successfully");

            return BadRequest("Failed to update performance configuration", result.Errors);
        }

        [HttpGet("health")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "SystemConfiguration", "Health" })]
        public async Task<IActionResult> GetSystemHealth()
        {
            var query = new GetSystemHealthQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "System health retrieved successfully");

            return BadRequest("Failed to retrieve system health", result.Errors);
        }

        [HttpGet("metrics")]
        [OutputCache(Duration = 60, Tags = new[] { "SystemConfiguration", "Metrics" })]
        public async Task<IActionResult> GetSystemMetrics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? metricType = null)
        {
            var query = new GetSystemMetricsQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddHours(-24),
                ToDate = toDate ?? DateTime.UtcNow,
                MetricType = metricType
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "System metrics retrieved successfully");

            return BadRequest("Failed to retrieve system metrics", result.Errors);
        }

        [HttpPost("clear-cache")]
        public async Task<IActionResult> ClearSystemCache([FromBody] ClearCacheRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ClearSystemCacheCommand
            {
                Request = request ?? new ClearCacheRequest(),
                ClearedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("System cache cleared successfully");

            return BadRequest("Failed to clear system cache", result.Errors);
        }

        [HttpPost("restart-services")]
        public async Task<IActionResult> RestartServices([FromBody] RestartServicesRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RestartServicesCommand
            {
                Request = request,
                RequestedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Services restart initiated successfully");

            return BadRequest("Failed to restart services", result.Errors);
        }

        [HttpGet("environment-info")]
        [OutputCache(Duration = 3600, Tags = new[] { "SystemConfiguration", "Environment" })]
        public async Task<IActionResult> GetEnvironmentInfo()
        {
            var query = new GetEnvironmentInfoQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Environment information retrieved successfully");

            return BadRequest("Failed to retrieve environment information", result.Errors);
        }

        [HttpPost("optimize-database")]
        public async Task<IActionResult> OptimizeDatabase()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new OptimizeDatabaseCommand { RequestedBy = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Database optimization completed successfully");

            return BadRequest("Failed to optimize database", result.Errors);
        }

        [HttpGet("feature-flags")]
        [OutputCache(Duration = 300, Tags = new[] { "SystemConfiguration", "FeatureFlags" })]
        public async Task<IActionResult> GetFeatureFlags()
        {
            var query = new GetFeatureFlagsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Feature flags retrieved successfully");

            return BadRequest("Failed to retrieve feature flags", result.Errors);
        }

        [HttpPut("feature-flags")]
        public async Task<IActionResult> UpdateFeatureFlags([FromBody] UpdateFeatureFlagsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateFeatureFlagsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Feature flags updated successfully");

            return BadRequest("Failed to update feature flags", result.Errors);
        }
    }
}