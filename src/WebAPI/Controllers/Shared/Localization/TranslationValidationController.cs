using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Features.Shared.Localization.Services;
using Asp.Versioning;

namespace WebAPI.Controllers.Shared.Localization;

/// <summary>
/// API Controller for translation validation and completeness checking
/// Implements Requirements: 15.1, 15.2, 15.4
/// </summary>
[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/localization/validation")]
[Authorize(Roles = "Admin")]
public class TranslationValidationController : ControllerBase
{
    private readonly ITranslationValidationService _validationService;
    private readonly ILogger<TranslationValidationController> _logger;

    public TranslationValidationController(
        ITranslationValidationService validationService,
        ILogger<TranslationValidationController> logger)
    {
        _validationService = validationService;
        _logger = logger;
    }

    /// <summary>
    /// Validates all translations across all cultures and features
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Comprehensive validation report</returns>
    [HttpGet("all")]
    public async Task<ActionResult<TranslationValidationReport>> ValidateAllTranslations(
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting comprehensive translation validation");
            var report = await _validationService.ValidateAllTranslationsAsync(cancellationToken);
            
            _logger.LogInformation("Translation validation completed. Overall completion: {Completion}%, Issues: {Issues}",
                report.OverallCompletionPercentage, report.TotalMissingKeys + report.TotalExtraKeys + report.TotalPlaceholderIssues);
            
            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during comprehensive translation validation");
            return StatusCode(500, new { Message = "Internal server error during validation", Error = ex.Message });
        }
    }

    /// <summary>
    /// Validates translations for a specific feature across all cultures
    /// </summary>
    /// <param name="feature">Feature name (e.g., posts, groups, qa)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Feature-specific validation report</returns>
    [HttpGet("feature/{feature}")]
    public async Task<ActionResult<TranslationValidationReport>> ValidateFeatureTranslations(
        string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(feature))
            {
                return BadRequest(new { Message = "Feature name is required" });
            }

            _logger.LogInformation("Validating translations for feature: {Feature}", feature);
            var report = await _validationService.ValidateFeatureTranslationsAsync(feature, cancellationToken);
            
            return Ok(report);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid feature specified: {Feature}", feature);
            return BadRequest(new { Message = ex.Message, Feature = feature });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating feature translations: {Feature}", feature);
            return StatusCode(500, new { Message = "Internal server error during feature validation", Error = ex.Message });
        }
    }

    /// <summary>
    /// Validates translations for a specific culture across all features
    /// </summary>
    /// <param name="culture">Culture code (e.g., ar-EG, ar-AE, ar-SA)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Culture-specific validation report</returns>
    [HttpGet("culture/{culture}")]
    public async Task<ActionResult<TranslationValidationReport>> ValidateCultureTranslations(
        string culture, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(culture))
            {
                return BadRequest(new { Message = "Culture code is required" });
            }

            _logger.LogInformation("Validating translations for culture: {Culture}", culture);
            var report = await _validationService.ValidateCultureTranslationsAsync(culture, cancellationToken);
            
            return Ok(report);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid culture specified: {Culture}", culture);
            return BadRequest(new { Message = ex.Message, Culture = culture });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating culture translations: {Culture}", culture);
            return StatusCode(500, new { Message = "Internal server error during culture validation", Error = ex.Message });
        }
    }

    /// <summary>
    /// Validates placeholder consistency for a specific culture and feature
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="feature">Feature name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Placeholder validation report</returns>
    [HttpGet("placeholders/{culture}/{feature}")]
    public async Task<ActionResult<PlaceholderValidationReport>> ValidatePlaceholderConsistency(
        string culture, string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(culture))
            {
                return BadRequest(new { Message = "Culture code is required" });
            }

            if (string.IsNullOrWhiteSpace(feature))
            {
                return BadRequest(new { Message = "Feature name is required" });
            }

            _logger.LogInformation("Validating placeholder consistency for {Culture}:{Feature}", culture, feature);
            var report = await _validationService.ValidatePlaceholderConsistencyAsync(culture, feature, cancellationToken);
            
            return Ok(report);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid parameters for placeholder validation: {Culture}:{Feature}", culture, feature);
            return BadRequest(new { Message = ex.Message, Culture = culture, Feature = feature });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating placeholder consistency: {Culture}:{Feature}", culture, feature);
            return StatusCode(500, new { Message = "Internal server error during placeholder validation", Error = ex.Message });
        }
    }

    /// <summary>
    /// Gets missing translation keys for a specific culture and feature
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="feature">Feature name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of missing translation keys</returns>
    [HttpGet("missing-keys/{culture}/{feature}")]
    public async Task<ActionResult<MissingKeysResponse>> GetMissingKeys(
        string culture, string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(culture))
            {
                return BadRequest(new { Message = "Culture code is required" });
            }

            if (string.IsNullOrWhiteSpace(feature))
            {
                return BadRequest(new { Message = "Feature name is required" });
            }

            _logger.LogInformation("Getting missing keys for {Culture}:{Feature}", culture, feature);
            var missingKeys = await _validationService.GetMissingKeysAsync(culture, feature, cancellationToken);
            
            var response = new MissingKeysResponse
            {
                Culture = culture,
                Feature = feature,
                MissingKeys = missingKeys,
                Count = missingKeys.Count,
                Timestamp = DateTime.UtcNow
            };

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid parameters for missing keys: {Culture}:{Feature}", culture, feature);
            return BadRequest(new { Message = ex.Message, Culture = culture, Feature = feature });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting missing keys: {Culture}:{Feature}", culture, feature);
            return StatusCode(500, new { Message = "Internal server error during missing keys retrieval", Error = ex.Message });
        }
    }

    /// <summary>
    /// Updates translation completeness tracking for a specific culture and feature
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="feature">Feature name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("update-completeness/{culture}/{feature}")]
    public async Task<ActionResult> UpdateTranslationCompleteness(
        string culture, string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(culture))
            {
                return BadRequest(new { Message = "Culture code is required" });
            }

            if (string.IsNullOrWhiteSpace(feature))
            {
                return BadRequest(new { Message = "Feature name is required" });
            }

            _logger.LogInformation("Updating translation completeness for {Culture}:{Feature}", culture, feature);
            await _validationService.UpdateTranslationCompletenessAsync(culture, feature, cancellationToken);
            
            return Ok(new { 
                Message = "Translation completeness updated successfully",
                Culture = culture,
                Feature = feature,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid parameters for completeness update: {Culture}:{Feature}", culture, feature);
            return BadRequest(new { Message = ex.Message, Culture = culture, Feature = feature });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating translation completeness: {Culture}:{Feature}", culture, feature);
            return StatusCode(500, new { Message = "Internal server error during completeness update", Error = ex.Message });
        }
    }

    /// <summary>
    /// Validates all translations and returns a summary report
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Summary validation report</returns>
    [HttpGet("summary")]
    public async Task<ActionResult<ValidationSummaryResponse>> GetValidationSummary(
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Generating validation summary");
            var report = await _validationService.ValidateAllTranslationsAsync(cancellationToken);
            
            var summary = new ValidationSummaryResponse
            {
                ValidationDate = report.ValidationDate,
                OverallCompletionPercentage = report.OverallCompletionPercentage,
                TotalFeatures = report.FeatureReports.Select(f => f.Feature).Distinct().Count(),
                TotalCultures = report.FeatureReports.Select(f => f.Culture).Distinct().Count(),
                TotalMissingKeys = report.TotalMissingKeys,
                TotalExtraKeys = report.TotalExtraKeys,
                TotalPlaceholderIssues = report.TotalPlaceholderIssues,
                FeatureSummaries = report.FeatureReports
                    .GroupBy(f => f.Feature)
                    .Select(g => new FeatureSummary
                    {
                        Feature = g.Key,
                        AverageCompletionPercentage = g.Average(f => f.CompletionPercentage),
                        TotalMissingKeys = g.Sum(f => f.MissingKeysCount),
                        TotalExtraKeys = g.Sum(f => f.ExtraKeysCount),
                        CultureCount = g.Count()
                    }).ToList(),
                CultureSummaries = report.FeatureReports
                    .GroupBy(f => f.Culture)
                    .Select(g => new CultureSummary
                    {
                        Culture = g.Key,
                        AverageCompletionPercentage = g.Average(f => f.CompletionPercentage),
                        TotalMissingKeys = g.Sum(f => f.MissingKeysCount),
                        TotalExtraKeys = g.Sum(f => f.ExtraKeysCount),
                        FeatureCount = g.Count()
                    }).ToList()
            };

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating validation summary");
            return StatusCode(500, new { Message = "Internal server error during summary generation", Error = ex.Message });
        }
    }
}

// Response DTOs
public class MissingKeysResponse
{
    public string Culture { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public List<string> MissingKeys { get; set; } = new();
    public int Count { get; set; }
    public DateTime Timestamp { get; set; }
}

public class ValidationSummaryResponse
{
    public DateTime ValidationDate { get; set; }
    public decimal OverallCompletionPercentage { get; set; }
    public int TotalFeatures { get; set; }
    public int TotalCultures { get; set; }
    public int TotalMissingKeys { get; set; }
    public int TotalExtraKeys { get; set; }
    public int TotalPlaceholderIssues { get; set; }
    public List<FeatureSummary> FeatureSummaries { get; set; } = new();
    public List<CultureSummary> CultureSummaries { get; set; } = new();
}

public class FeatureSummary
{
    public string Feature { get; set; } = string.Empty;
    public decimal AverageCompletionPercentage { get; set; }
    public int TotalMissingKeys { get; set; }
    public int TotalExtraKeys { get; set; }
    public int CultureCount { get; set; }
}

public class CultureSummary
{
    public string Culture { get; set; } = string.Empty;
    public decimal AverageCompletionPercentage { get; set; }
    public int TotalMissingKeys { get; set; }
    public int TotalExtraKeys { get; set; }
    public int FeatureCount { get; set; }
}