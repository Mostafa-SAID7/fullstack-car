using Application.Common.Interfaces;
using Domain.Entities.Shared.Localization;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using global::System.Text.Json;
using System.Text.RegularExpressions;

namespace Application.Features.Shared.Localization.Services;

/// <summary>
/// Service for validating translation completeness and consistency
/// </summary>
public interface ITranslationValidationService
{
    Task<TranslationValidationReport> ValidateAllTranslationsAsync(CancellationToken cancellationToken = default);
    Task<TranslationValidationReport> ValidateFeatureTranslationsAsync(string feature, CancellationToken cancellationToken = default);
    Task<TranslationValidationReport> ValidateCultureTranslationsAsync(string culture, CancellationToken cancellationToken = default);
    Task<PlaceholderValidationReport> ValidatePlaceholderConsistencyAsync(string culture, string feature, CancellationToken cancellationToken = default);
    Task<List<string>> GetMissingKeysAsync(string culture, string feature, CancellationToken cancellationToken = default);
    Task UpdateTranslationCompletenessAsync(string culture, string feature, CancellationToken cancellationToken = default);
}

public class TranslationValidationService : ITranslationValidationService
{
    private readonly ITranslationRepository _translationRepository;
    private readonly IRepository<TranslationCompleteness> _completenessRepository;
    private readonly ILogger<TranslationValidationService> _logger;
    
    private static readonly string[] SupportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };
    private static readonly Regex PlaceholderPattern = new(@"\{(\d+)\}", RegexOptions.Compiled);
    private static readonly Regex NamedPlaceholderPattern = new(@"\{([a-zA-Z_][a-zA-Z0-9_]*)\}", RegexOptions.Compiled);

    public TranslationValidationService(
        ITranslationRepository translationRepository,
        IRepository<TranslationCompleteness> completenessRepository,
        ILogger<TranslationValidationService> logger)
    {
        _translationRepository = translationRepository;
        _completenessRepository = completenessRepository;
        _logger = logger;
    }

    public async Task<TranslationValidationReport> ValidateAllTranslationsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Starting comprehensive translation validation");
        
        var report = new TranslationValidationReport
        {
            ValidationDate = DateTime.UtcNow,
            Scope = "All"
        };

        var tasks = new List<Task>();
        
        foreach (var culture in SupportedCultures.Where(c => c != "en-US"))
        {
            tasks.Add(ValidateCultureAsync(culture, report, cancellationToken));
        }

        await Task.WhenAll(tasks);

        // Calculate overall statistics
        report.OverallCompletionPercentage = report.FeatureReports.Any() 
            ? report.FeatureReports.Average(f => f.CompletionPercentage)
            : 100.0m;
        
        report.TotalMissingKeys = report.FeatureReports.Sum(f => f.MissingKeysCount);
        report.TotalExtraKeys = report.FeatureReports.Sum(f => f.ExtraKeysCount);
        report.TotalPlaceholderIssues = report.PlaceholderReports.Sum(p => p.InconsistentPlaceholders.Count);

        _logger.LogInformation("Translation validation completed. Overall completion: {Completion}%, Missing keys: {MissingKeys}", 
            report.OverallCompletionPercentage, report.TotalMissingKeys);

        return report;
    }

    public async Task<TranslationValidationReport> ValidateFeatureTranslationsAsync(string feature, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Validating translations for feature: {Feature}", feature);
        
        var report = new TranslationValidationReport
        {
            ValidationDate = DateTime.UtcNow,
            Scope = $"Feature: {feature}"
        };

        var tasks = SupportedCultures.Where(c => c != "en-US")
            .Select(culture => ValidateFeatureCultureAsync(culture, feature, report, cancellationToken));

        await Task.WhenAll(tasks);

        // Calculate feature statistics
        var featureReport = report.FeatureReports.FirstOrDefault(f => f.Feature == feature);
        if (featureReport != null)
        {
            report.OverallCompletionPercentage = featureReport.CompletionPercentage;
            report.TotalMissingKeys = featureReport.MissingKeysCount;
            report.TotalExtraKeys = featureReport.ExtraKeysCount;
        }

        return report;
    }

    public async Task<TranslationValidationReport> ValidateCultureTranslationsAsync(string culture, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Validating translations for culture: {Culture}", culture);
        
        var report = new TranslationValidationReport
        {
            ValidationDate = DateTime.UtcNow,
            Scope = $"Culture: {culture}"
        };

        await ValidateCultureAsync(culture, report, cancellationToken);

        return report;
    }

    public async Task<PlaceholderValidationReport> ValidatePlaceholderConsistencyAsync(string culture, string feature, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Validating placeholder consistency for {Culture}:{Feature}", culture, feature);
        
        var report = new PlaceholderValidationReport
        {
            Culture = culture,
            Feature = feature,
            ValidationDate = DateTime.UtcNow
        };

        try
        {
            var referenceTranslations = await _translationRepository.GetTranslationsAsync("en-US", feature, cancellationToken);
            var targetTranslations = await _translationRepository.GetTranslationsAsync(culture, feature, cancellationToken);

            foreach (var referenceKvp in referenceTranslations)
            {
                if (!targetTranslations.TryGetValue(referenceKvp.Key, out var targetValue))
                {
                    continue; // Missing key, handled elsewhere
                }

                var referencePlaceholders = ExtractPlaceholders(referenceKvp.Value);
                var targetPlaceholders = ExtractPlaceholders(targetValue);

                if (!PlaceholdersMatch(referencePlaceholders, targetPlaceholders))
                {
                    report.InconsistentPlaceholders.Add(new PlaceholderInconsistency
                    {
                        Key = referenceKvp.Key,
                        ReferenceValue = referenceKvp.Value,
                        TargetValue = targetValue,
                        ReferencePlaceholders = referencePlaceholders,
                        TargetPlaceholders = targetPlaceholders
                    });
                }
            }

            report.IsValid = !report.InconsistentPlaceholders.Any();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating placeholder consistency for {Culture}:{Feature}", culture, feature);
            report.IsValid = false;
        }

        return report;
    }

    public async Task<List<string>> GetMissingKeysAsync(string culture, string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            var referenceTranslations = await _translationRepository.GetTranslationsAsync("en-US", feature, cancellationToken);
            var targetTranslations = await _translationRepository.GetTranslationsAsync(culture, feature, cancellationToken);

            return referenceTranslations.Keys
                .Where(key => !targetTranslations.ContainsKey(key))
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting missing keys for {Culture}:{Feature}", culture, feature);
            return new List<string>();
        }
    }

    public async Task UpdateTranslationCompletenessAsync(string culture, string feature, CancellationToken cancellationToken = default)
    {
        try
        {
            var referenceTranslations = await _translationRepository.GetTranslationsAsync("en-US", feature, cancellationToken);
            var targetTranslations = await _translationRepository.GetTranslationsAsync(culture, feature, cancellationToken);

            var totalKeys = referenceTranslations.Count;
            var translatedKeys = referenceTranslations.Keys.Count(key => targetTranslations.ContainsKey(key));
            var completionPercentage = totalKeys > 0 ? (decimal)translatedKeys / totalKeys * 100 : 100;

            // Find existing record or create new one
            var existing = await _completenessRepository.FirstOrDefaultAsync(
                new TranslationCompletenessSpecification(culture, feature), cancellationToken);

            if (existing != null)
            {
                existing.TotalKeys = totalKeys;
                existing.TranslatedKeys = translatedKeys;
                existing.CompletionPercentage = completionPercentage;
                existing.LastUpdated = DateTime.UtcNow;
                
                await _completenessRepository.UpdateAsync(existing, cancellationToken);
            }
            else
            {
                var completeness = new TranslationCompleteness
                {
                    Culture = culture,
                    Feature = feature,
                    TotalKeys = totalKeys,
                    TranslatedKeys = translatedKeys,
                    CompletionPercentage = completionPercentage,
                    LastUpdated = DateTime.UtcNow
                };

                await _completenessRepository.AddAsync(completeness, cancellationToken);
            }

            _logger.LogDebug("Updated translation completeness for {Culture}:{Feature} - {Completion}%", 
                culture, feature, completionPercentage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating translation completeness for {Culture}:{Feature}", culture, feature);
        }
    }

    private async Task ValidateCultureAsync(string culture, TranslationValidationReport report, CancellationToken cancellationToken)
    {
        var availableFeatures = await _translationRepository.GetAvailableFeaturesAsync(culture, cancellationToken);
        
        var tasks = availableFeatures.Select(feature => 
            ValidateFeatureCultureAsync(culture, feature, report, cancellationToken));

        await Task.WhenAll(tasks);
    }

    private async Task ValidateFeatureCultureAsync(string culture, string feature, TranslationValidationReport report, CancellationToken cancellationToken)
    {
        try
        {
            var referenceTranslations = await _translationRepository.GetTranslationsAsync("en-US", feature, cancellationToken);
            var targetTranslations = await _translationRepository.GetTranslationsAsync(culture, feature, cancellationToken);

            var missingKeys = referenceTranslations.Keys.Where(key => !targetTranslations.ContainsKey(key)).ToList();
            var extraKeys = targetTranslations.Keys.Where(key => !referenceTranslations.ContainsKey(key)).ToList();
            
            var totalKeys = referenceTranslations.Count;
            var translatedKeys = totalKeys - missingKeys.Count;
            var completionPercentage = totalKeys > 0 ? (decimal)translatedKeys / totalKeys * 100 : 100;

            var featureReport = new FeatureValidationReport
            {
                Culture = culture,
                Feature = feature,
                TotalKeys = totalKeys,
                TranslatedKeys = translatedKeys,
                CompletionPercentage = completionPercentage,
                MissingKeys = missingKeys,
                ExtraKeys = extraKeys,
                MissingKeysCount = missingKeys.Count,
                ExtraKeysCount = extraKeys.Count
            };

            lock (report)
            {
                report.FeatureReports.Add(featureReport);
            }

            // Validate placeholders
            var placeholderReport = await ValidatePlaceholderConsistencyAsync(culture, feature, cancellationToken);
            lock (report)
            {
                report.PlaceholderReports.Add(placeholderReport);
            }

            // Update completeness tracking
            await UpdateTranslationCompletenessAsync(culture, feature, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating {Culture}:{Feature}", culture, feature);
        }
    }

    private List<string> ExtractPlaceholders(string text)
    {
        var placeholders = new List<string>();
        
        // Extract numbered placeholders {0}, {1}, etc.
        var numberedMatches = PlaceholderPattern.Matches(text);
        placeholders.AddRange(numberedMatches.Select(m => m.Value));
        
        // Extract named placeholders {name}, {value}, etc.
        var namedMatches = NamedPlaceholderPattern.Matches(text);
        placeholders.AddRange(namedMatches.Select(m => m.Value));
        
        return placeholders.Distinct().OrderBy(p => p).ToList();
    }

    private bool PlaceholdersMatch(List<string> reference, List<string> target)
    {
        if (reference.Count != target.Count)
            return false;

        return reference.OrderBy(p => p).SequenceEqual(target.OrderBy(p => p));
    }
}

// Data models for validation reports
public class TranslationValidationReport
{
    public DateTime ValidationDate { get; set; }
    public string Scope { get; set; } = string.Empty;
    public decimal OverallCompletionPercentage { get; set; }
    public int TotalMissingKeys { get; set; }
    public int TotalExtraKeys { get; set; }
    public int TotalPlaceholderIssues { get; set; }
    public List<FeatureValidationReport> FeatureReports { get; set; } = new();
    public List<PlaceholderValidationReport> PlaceholderReports { get; set; } = new();
}

public class FeatureValidationReport
{
    public string Culture { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public int TotalKeys { get; set; }
    public int TranslatedKeys { get; set; }
    public decimal CompletionPercentage { get; set; }
    public List<string> MissingKeys { get; set; } = new();
    public List<string> ExtraKeys { get; set; } = new();
    public int MissingKeysCount { get; set; }
    public int ExtraKeysCount { get; set; }
}

public class PlaceholderValidationReport
{
    public string Culture { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public DateTime ValidationDate { get; set; }
    public bool IsValid { get; set; }
    public List<PlaceholderInconsistency> InconsistentPlaceholders { get; set; } = new();
}

public class PlaceholderInconsistency
{
    public string Key { get; set; } = string.Empty;
    public string ReferenceValue { get; set; } = string.Empty;
    public string TargetValue { get; set; } = string.Empty;
    public List<string> ReferencePlaceholders { get; set; } = new();
    public List<string> TargetPlaceholders { get; set; } = new();
}

// Specification for querying translation completeness
public class TranslationCompletenessSpecification : ISpecification<TranslationCompleteness>
{
    private readonly string _culture;
    private readonly string _feature;

    public TranslationCompletenessSpecification(string culture, string feature)
    {
        _culture = culture;
        _feature = feature;
    }

    public Expression<Func<TranslationCompleteness, bool>>? Criteria => 
        x => x.Culture == _culture && x.Feature == _feature;

    public List<Expression<Func<TranslationCompleteness, object>>> Includes { get; } = new();

    public List<string> IncludeStrings { get; } = new();

    public Expression<Func<TranslationCompleteness, object>>? OrderBy => null;

    public Expression<Func<TranslationCompleteness, object>>? OrderByDescending => null;

    public Expression<Func<TranslationCompleteness, object>>? GroupBy => null;

    public int Take => 0;

    public int Skip => 0;

    public bool IsPagingEnabled => false;

    public bool IsSatisfiedBy(TranslationCompleteness entity)
    {
        return entity.Culture == _culture && entity.Feature == _feature;
    }
}