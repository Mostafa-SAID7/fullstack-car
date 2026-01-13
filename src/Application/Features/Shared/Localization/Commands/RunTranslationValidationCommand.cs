using MediatR;
using Application.Features.Shared.Localization.Services;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Localization.Commands;

/// <summary>
/// Command to run comprehensive translation validation
/// Implements Requirements: 15.1, 15.2, 15.4
/// </summary>
public class RunTranslationValidationCommand : IRequest<TranslationValidationResult>
{
    public string? Culture { get; set; }
    public string? Feature { get; set; }
    public bool IncludePlaceholderValidation { get; set; } = true;
    public bool UpdateCompleteness { get; set; } = true;
    public bool GenerateReport { get; set; } = false;
}

public class RunTranslationValidationCommandHandler : IRequestHandler<RunTranslationValidationCommand, TranslationValidationResult>
{
    private readonly ITranslationValidationService _validationService;
    private readonly ILogger<RunTranslationValidationCommandHandler> _logger;

    public RunTranslationValidationCommandHandler(
        ITranslationValidationService validationService,
        ILogger<RunTranslationValidationCommandHandler> logger)
    {
        _validationService = validationService;
        _logger = logger;
    }

    public async Task<TranslationValidationResult> Handle(RunTranslationValidationCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting translation validation with parameters: Culture={Culture}, Feature={Feature}", 
            request.Culture ?? "All", request.Feature ?? "All");

        var result = new TranslationValidationResult
        {
            StartTime = DateTime.UtcNow,
            Parameters = new ValidationParameters
            {
                Culture = request.Culture,
                Feature = request.Feature,
                IncludePlaceholderValidation = request.IncludePlaceholderValidation,
                UpdateCompleteness = request.UpdateCompleteness
            }
        };

        try
        {
            TranslationValidationReport report;

            // Determine validation scope and execute appropriate validation
            if (!string.IsNullOrEmpty(request.Culture) && !string.IsNullOrEmpty(request.Feature))
            {
                // Validate specific culture and feature
                _logger.LogInformation("Validating specific culture and feature: {Culture}:{Feature}", request.Culture, request.Feature);
                
                report = new TranslationValidationReport
                {
                    ValidationDate = DateTime.UtcNow,
                    Scope = $"Culture: {request.Culture}, Feature: {request.Feature}"
                };

                // Get missing keys
                var missingKeys = await _validationService.GetMissingKeysAsync(request.Culture, request.Feature, cancellationToken);
                
                // Validate placeholders if requested
                PlaceholderValidationReport? placeholderReport = null;
                if (request.IncludePlaceholderValidation)
                {
                    placeholderReport = await _validationService.ValidatePlaceholderConsistencyAsync(request.Culture, request.Feature, cancellationToken);
                    report.PlaceholderReports.Add(placeholderReport);
                }

                // Update completeness if requested
                if (request.UpdateCompleteness)
                {
                    await _validationService.UpdateTranslationCompletenessAsync(request.Culture, request.Feature, cancellationToken);
                }

                // Create feature report
                var featureReport = new FeatureValidationReport
                {
                    Culture = request.Culture,
                    Feature = request.Feature,
                    MissingKeys = missingKeys,
                    MissingKeysCount = missingKeys.Count,
                    CompletionPercentage = 100 - (missingKeys.Count > 0 ? (decimal)missingKeys.Count / 100 * 100 : 0) // Simplified calculation
                };

                report.FeatureReports.Add(featureReport);
                report.TotalMissingKeys = missingKeys.Count;
                report.TotalPlaceholderIssues = placeholderReport?.InconsistentPlaceholders.Count ?? 0;
            }
            else if (!string.IsNullOrEmpty(request.Culture))
            {
                // Validate specific culture
                _logger.LogInformation("Validating culture: {Culture}", request.Culture);
                report = await _validationService.ValidateCultureTranslationsAsync(request.Culture, cancellationToken);
            }
            else if (!string.IsNullOrEmpty(request.Feature))
            {
                // Validate specific feature
                _logger.LogInformation("Validating feature: {Feature}", request.Feature);
                report = await _validationService.ValidateFeatureTranslationsAsync(request.Feature, cancellationToken);
            }
            else
            {
                // Validate all translations
                _logger.LogInformation("Validating all translations");
                report = await _validationService.ValidateAllTranslationsAsync(cancellationToken);
            }

            result.Report = report;
            result.Success = true;
            result.EndTime = DateTime.UtcNow;
            result.Duration = result.EndTime - result.StartTime;

            // Generate summary
            result.Summary = new ValidationSummary
            {
                TotalFeatures = report.FeatureReports.Select(f => f.Feature).Distinct().Count(),
                TotalCultures = report.FeatureReports.Select(f => f.Culture).Distinct().Count(),
                OverallCompletionPercentage = report.OverallCompletionPercentage,
                TotalIssues = report.TotalMissingKeys + report.TotalExtraKeys + report.TotalPlaceholderIssues,
                HasCriticalIssues = report.TotalPlaceholderIssues > 0,
                HasWarnings = report.TotalMissingKeys > 0 || report.TotalExtraKeys > 0
            };

            _logger.LogInformation("Translation validation completed successfully. Duration: {Duration}ms, Issues: {Issues}", 
                result.Duration.TotalMilliseconds, result.Summary.TotalIssues);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during translation validation");
            result.Success = false;
            result.ErrorMessage = ex.Message;
            result.EndTime = DateTime.UtcNow;
            result.Duration = result.EndTime - result.StartTime;
        }

        return result;
    }
}

// Result DTOs
public class TranslationValidationResult
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public TimeSpan Duration { get; set; }
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public ValidationParameters Parameters { get; set; } = new();
    public TranslationValidationReport? Report { get; set; }
    public ValidationSummary Summary { get; set; } = new();
}

public class ValidationParameters
{
    public string? Culture { get; set; }
    public string? Feature { get; set; }
    public bool IncludePlaceholderValidation { get; set; }
    public bool UpdateCompleteness { get; set; }
}

public class ValidationSummary
{
    public int TotalFeatures { get; set; }
    public int TotalCultures { get; set; }
    public decimal OverallCompletionPercentage { get; set; }
    public int TotalIssues { get; set; }
    public bool HasCriticalIssues { get; set; }
    public bool HasWarnings { get; set; }
}