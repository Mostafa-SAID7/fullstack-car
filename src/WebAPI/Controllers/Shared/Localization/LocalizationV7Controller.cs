using Microsoft.AspNetCore.Mvc;
using MediatR;
using Asp.Versioning;
using Application.Features.Shared.Localization.Queries;
using Application.Features.Shared.Localization.Commands;
using Application.Features.Shared.Localization.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers.Shared.Localization;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/localization")]
public class LocalizationV7Controller : BaseController
{
    private readonly IMediator _mediator;
    private readonly ILogger<LocalizationV7Controller> _logger;

    public LocalizationV7Controller(IMediator mediator, ILogger<LocalizationV7Controller> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Gets translations for a specific culture and feature
    /// </summary>
    /// <param name="culture">Culture code (e.g., en-US, ar-EG)</param>
    /// <param name="feature">Feature name (e.g., posts, groups, qa)</param>
    /// <returns>Dictionary of translation keys and values</returns>
    [HttpGet("translations/{culture}/{feature}")]
    [ProducesResponseType(typeof(Dictionary<string, string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTranslations(string culture, string feature)
    {
        try
        {
            // Validate input parameters
            if (string.IsNullOrWhiteSpace(culture) || string.IsNullOrWhiteSpace(feature))
            {
                return BadRequest(new { 
                    Message = "Culture and feature are required",
                    Culture = culture,
                    Feature = feature
                });
            }

            _logger.LogInformation("Getting translations for culture: {Culture}, feature: {Feature}", culture, feature);

            var query = new GetFeatureTranslationsQuery
            {
                Culture = culture,
                Feature = feature
            };

            var result = await _mediator.Send(query);

            if (!result.Any())
            {
                _logger.LogWarning("No translations found for culture: {Culture}, feature: {Feature}", culture, feature);
                return NotFound(new { 
                    Message = $"No translations found for culture '{culture}' and feature '{feature}'",
                    Culture = culture,
                    Feature = feature
                });
            }

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid request parameters for culture: {Culture}, feature: {Feature}", culture, feature);
            return BadRequest(new { 
                Message = ex.Message, 
                Culture = culture, 
                Feature = feature 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting translations for culture: {Culture}, feature: {Feature}", culture, feature);
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while retrieving translations" 
            });
        }
    }

    /// <summary>
    /// Gets translations for multiple features in a single culture (batch operation)
    /// </summary>
    /// <param name="request">Batch translation request containing culture and features</param>
    /// <returns>Dictionary with feature names as keys and translation dictionaries as values</returns>
    [HttpPost("translations/batch")]
    [ProducesResponseType(typeof(Dictionary<string, Dictionary<string, string>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetBatchTranslations([FromBody] BatchTranslationRequestDto request)
    {
        try
        {
            _logger.LogInformation("Getting batch translations for culture: {Culture}, features: {Features}", 
                request.Culture, string.Join(", ", request.Features));

            var query = new GetBatchTranslationsQuery
            {
                Culture = request.Culture,
                Features = request.Features
            };

            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid batch translation request for culture: {Culture}", request.Culture);
            return BadRequest(new { 
                Message = ex.Message, 
                Culture = request.Culture,
                Features = request.Features
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting batch translations for culture: {Culture}", request.Culture);
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while retrieving batch translations" 
            });
        }
    }

    /// <summary>
    /// Gets all supported cultures
    /// </summary>
    /// <returns>List of supported culture codes</returns>
    [HttpGet("cultures/supported")]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSupportedCultures()
    {
        try
        {
            _logger.LogInformation("Getting supported cultures");

            var query = new GetSupportedCulturesQuery();
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting supported cultures");
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while retrieving supported cultures" 
            });
        }
    }

    /// <summary>
    /// Invalidates translation cache for specific culture and/or feature
    /// </summary>
    /// <param name="culture">Culture code (optional - null to invalidate all cultures)</param>
    /// <param name="feature">Feature name (optional - null to invalidate all features)</param>
    /// <returns>Success confirmation</returns>
    [HttpDelete("cache")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> InvalidateCache([FromQuery] string? culture = null, [FromQuery] string? feature = null)
    {
        try
        {
            _logger.LogInformation("Invalidating translation cache for culture: {Culture}, feature: {Feature}", 
                culture ?? "all", feature ?? "all");

            var command = new InvalidateTranslationCacheCommand
            {
                Culture = culture,
                Feature = feature
            };

            await _mediator.Send(command);

            return Ok(new { 
                Message = "Cache invalidated successfully",
                Culture = culture ?? "all",
                Feature = feature ?? "all",
                Timestamp = DateTime.UtcNow
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid cache invalidation request for culture: {Culture}, feature: {Feature}", culture, feature);
            return BadRequest(new { 
                Message = ex.Message, 
                Culture = culture, 
                Feature = feature 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating cache for culture: {Culture}, feature: {Feature}", culture, feature);
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while invalidating cache" 
            });
        }
    }

    /// <summary>
    /// Warms up translation cache for specific culture and features
    /// </summary>
    /// <param name="request">Cache warming request</param>
    /// <returns>Cache warming results</returns>
    [HttpPost("cache/warm")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> WarmCache([FromBody] WarmCacheRequestDto request)
    {
        try
        {
            _logger.LogInformation("Warming translation cache for culture: {Culture}, features: {Features}", 
                request.Culture, string.Join(", ", request.Features));

            var command = new WarmTranslationCacheCommand
            {
                Culture = request.Culture,
                Features = request.Features
            };

            var result = await _mediator.Send(command);

            return Ok(new { 
                Message = "Cache warmed successfully",
                Culture = request.Culture,
                Features = request.Features,
                Results = result,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid cache warming request for culture: {Culture}", request.Culture);
            return BadRequest(new { 
                Message = ex.Message, 
                Culture = request.Culture,
                Features = request.Features
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error warming cache for culture: {Culture}", request.Culture);
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while warming cache" 
            });
        }
    }

    /// <summary>
    /// Gets translation cache performance metrics
    /// </summary>
    /// <returns>Cache performance statistics</returns>
    [HttpGet("cache/metrics")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCacheMetrics()
    {
        try
        {
            _logger.LogInformation("Getting translation cache metrics");

            var query = new GetTranslationCacheMetricsQuery();
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cache metrics");
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while retrieving cache metrics" 
            });
        }
    }
}