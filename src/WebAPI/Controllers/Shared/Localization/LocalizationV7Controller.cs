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
[AllowAnonymous]
public class LocalizationV7Controller : BaseController
{
    private readonly IMediator _mediator;
    private readonly ILogger<LocalizationV7Controller> _logger;

    public LocalizationV7Controller(IMediator mediator, ILogger<LocalizationV7Controller> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }
    [HttpGet("translations")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(PagedResult<Application.Features.Shared.Localization.DTOs.TranslationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTranslations([FromQuery] GetTranslationsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
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
    [HttpPost("updates/{culture}")]
    [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTranslationUpdates(string culture, [FromBody] TranslationUpdatesRequestDto request)
    {
        try
        {
            var result = await _mediator.Send(new GetTranslationUpdatesQuery 
            { 
                Culture = culture, 
                Features = request.Features, 
                Since = request.Since 
            });
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting translation updates for culture: {Culture}", culture);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An error occurred" });
        }
    }
    [HttpPost("translations")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTranslation([FromBody] CreateTranslationCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating translation");
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
        }
    }
    [HttpPut("translations/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTranslation(string id, [FromBody] UpdateTranslationCommand command)
    {
        try
        {
            command.Id = id;
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating translation {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
        }
    }
    [HttpDelete("translations/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTranslation(string id)
    {
        try
        {
            var result = await _mediator.Send(new DeleteTranslationCommand { Id = id });
            return Ok(new { Success = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting translation {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
        }
    }
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
    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetTranslationStats()
    {
        var result = await _mediator.Send(new GetTranslationStatsQuery());
        return Ok(result);
    }
    [HttpPost("bulk-import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BulkImportTranslations([FromBody] BulkImportTranslationsCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
    [HttpPost("export")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ExportTranslations([FromBody] ExportTranslationsCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return File(result.Content, result.ContentType, result.FileName);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
    [HttpPost("validate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ValidateTranslations([FromBody] RunTranslationValidationCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating translations");
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
        }
    }
    [HttpGet("detect")]
    public async Task<IActionResult> DetectLanguage()
    {
        var result = await _mediator.Send(new DetectLanguageQuery
        {
            AcceptLanguage = Request.Headers["Accept-Language"].ToString(),
            UserAgent = Request.Headers["User-Agent"].ToString()
        });
        return Ok(result);
    }
    [HttpGet("culture/{language}")]
    public async Task<IActionResult> GetCultureInfo(string language)
    {
        try
        {
            var result = await _mediator.Send(new GetCultureInfoQuery { Language = language });
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message, Language = language });
        }
    }
    [HttpGet("resources/files")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<ResourceFileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetResourceFiles()
    {
        try
        {
            _logger.LogInformation("Getting physical localization resource files");
            var result = await _mediator.Send(new GetResourceFilesQuery());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting resource files");
            return StatusCode(StatusCodes.Status500InternalServerError, new { 
                Message = "An error occurred while retrieving resource files" 
            });
        }
    }
}


