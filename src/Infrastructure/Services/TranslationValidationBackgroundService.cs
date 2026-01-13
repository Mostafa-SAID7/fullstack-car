using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Application.Features.Shared.Localization.Services;

namespace Infrastructure.Services;

/// <summary>
/// Background service for periodic translation validation
/// Implements Requirements: 15.1, 15.2, 15.4
/// </summary>
public class TranslationValidationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TranslationValidationBackgroundService> _logger;
    private readonly TranslationValidationSettings _settings;
    private readonly TimeSpan _validationInterval;

    public TranslationValidationBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<TranslationValidationBackgroundService> logger,
        IOptions<TranslationValidationSettings> settings)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _settings = settings.Value;
        _validationInterval = TimeSpan.FromHours(_settings.ValidationIntervalHours);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Translation validation background service started. Interval: {Interval} hours", 
            _settings.ValidationIntervalHours);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PerformValidationAsync(stoppingToken);
                
                _logger.LogInformation("Next translation validation scheduled in {Interval} hours", 
                    _settings.ValidationIntervalHours);
                
                await Task.Delay(_validationInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Translation validation background service is stopping");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in translation validation background service");
                
                // Wait a shorter interval before retrying on error
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }
    }

    private async Task PerformValidationAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting scheduled translation validation");
        
        using var scope = _serviceProvider.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<ITranslationValidationService>();
        
        try
        {
            var startTime = DateTime.UtcNow;
            
            // Perform comprehensive validation
            var report = await validationService.ValidateAllTranslationsAsync(cancellationToken);
            
            var duration = DateTime.UtcNow - startTime;
            
            // Log summary results
            _logger.LogInformation("Scheduled validation completed in {Duration}ms. " +
                "Completion: {Completion}%, Missing keys: {MissingKeys}, Extra keys: {ExtraKeys}, Placeholder issues: {PlaceholderIssues}",
                duration.TotalMilliseconds,
                report.OverallCompletionPercentage,
                report.TotalMissingKeys,
                report.TotalExtraKeys,
                report.TotalPlaceholderIssues);

            // Check for critical issues that need immediate attention
            if (report.TotalPlaceholderIssues > 0)
            {
                _logger.LogWarning("Critical translation issues detected: {PlaceholderIssues} placeholder inconsistencies found", 
                    report.TotalPlaceholderIssues);
                
                // Log details of placeholder issues
                foreach (var placeholderReport in report.PlaceholderReports.Where(p => !p.IsValid))
                {
                    _logger.LogWarning("Placeholder issues in {Culture}:{Feature} - {Count} inconsistencies",
                        placeholderReport.Culture, placeholderReport.Feature, placeholderReport.InconsistentPlaceholders.Count);
                }
            }

            // Check for significant missing translations
            if (report.TotalMissingKeys > _settings.MissingKeysThreshold)
            {
                _logger.LogWarning("High number of missing translation keys detected: {MissingKeys} (threshold: {Threshold})",
                    report.TotalMissingKeys, _settings.MissingKeysThreshold);
            }

            // Check for low completion percentage
            if (report.OverallCompletionPercentage < _settings.MinimumCompletionPercentage)
            {
                _logger.LogWarning("Translation completion below threshold: {Completion}% (minimum: {Threshold}%)",
                    report.OverallCompletionPercentage, _settings.MinimumCompletionPercentage);
            }

            // Update completeness tracking for all cultures and features
            if (_settings.AutoUpdateCompleteness)
            {
                await UpdateCompletenessTrackingAsync(validationService, report, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during scheduled translation validation");
            throw;
        }
    }

    private async Task UpdateCompletenessTrackingAsync(
        ITranslationValidationService validationService,
        TranslationValidationReport report,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating translation completeness tracking");
        
        var updateTasks = new List<Task>();
        
        foreach (var featureReport in report.FeatureReports)
        {
            updateTasks.Add(validationService.UpdateTranslationCompletenessAsync(
                featureReport.Culture, featureReport.Feature, cancellationToken));
        }
        
        await Task.WhenAll(updateTasks);
        
        _logger.LogInformation("Translation completeness tracking updated for {Count} culture/feature combinations",
            updateTasks.Count);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Translation validation background service is stopping");
        await base.StopAsync(cancellationToken);
    }
}

/// <summary>
/// Configuration settings for translation validation background service
/// </summary>
public class TranslationValidationSettings
{
    public const string SectionName = "TranslationValidation";

    /// <summary>
    /// Interval in hours between validation runs (default: 24 hours)
    /// </summary>
    public int ValidationIntervalHours { get; set; } = 24;

    /// <summary>
    /// Threshold for missing keys that triggers a warning (default: 50)
    /// </summary>
    public int MissingKeysThreshold { get; set; } = 50;

    /// <summary>
    /// Minimum completion percentage before triggering a warning (default: 80%)
    /// </summary>
    public decimal MinimumCompletionPercentage { get; set; } = 80.0m;

    /// <summary>
    /// Whether to automatically update completeness tracking (default: true)
    /// </summary>
    public bool AutoUpdateCompleteness { get; set; } = true;

    /// <summary>
    /// Whether the background service is enabled (default: true)
    /// </summary>
    public bool Enabled { get; set; } = true;
}