using Application.Common.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services;

public class TranslationCacheWarmupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TranslationCacheWarmupService> _logger;
    private readonly TranslationCacheWarmupOptions _options;

    public TranslationCacheWarmupService(
        IServiceProvider serviceProvider,
        ILogger<TranslationCacheWarmupService> logger,
        IOptions<TranslationCacheWarmupOptions> options)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_options.EnableBackgroundWarmup)
        {
            _logger.LogInformation("Background cache warmup is disabled");
            return;
        }

        _logger.LogInformation("Starting translation cache warmup service");

        try
        {
            // Wait for the application to fully start up and database to be available
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

            // Check if we can access the database before starting warmup
            if (!await WaitForDatabaseAsync(stoppingToken))
            {
                _logger.LogWarning("Database is not available, skipping cache warmup");
                return;
            }

            // Initial warmup
            await WarmupCacheAsync(stoppingToken);

            // Periodic warmup
            using var timer = new PeriodicTimer(TimeSpan.FromHours(_options.WarmupIntervalHours));
            
            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                await WarmupCacheAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Translation cache warmup service was cancelled");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Translation cache warmup service failed during execution");
            // Don't rethrow - let the service continue running
        }
    }

    private async Task WarmupCacheAsync(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Starting cache warmup process");

            using var scope = _serviceProvider.CreateScope();
            var translationRepository = scope.ServiceProvider.GetRequiredService<ITranslationRepository>();

            var supportedCultures = await translationRepository.GetSupportedCulturesAsync(cancellationToken);
            var totalWarmed = 0;

            foreach (var culture in supportedCultures)
            {
                if (cancellationToken.IsCancellationRequested)
                    break;

                try
                {
                    var availableFeatures = await translationRepository.GetAvailableFeaturesAsync(culture, cancellationToken);
                    
                    foreach (var feature in availableFeatures.Take(_options.MaxFeaturesPerCulture))
                    {
                        if (cancellationToken.IsCancellationRequested)
                            break;

                        try
                        {
                            // Pre-load translations into cache
                            var translations = await translationRepository.GetTranslationsAsync(culture, feature, cancellationToken);
                            
                            if (translations.Any())
                            {
                                totalWarmed++;
                                _logger.LogDebug("Warmed cache for {Culture}:{Feature} ({KeyCount} keys)", 
                                    culture, feature, translations.Count);
                            }

                            // Small delay to avoid overwhelming the system
                            await Task.Delay(_options.DelayBetweenRequestsMs, cancellationToken);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Failed to warm cache for {Culture}:{Feature}", culture, feature);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to get available features for culture: {Culture}", culture);
                }
            }

            _logger.LogInformation("Cache warmup completed. Warmed {TotalWarmed} culture/feature combinations", totalWarmed);
        }
        catch (ObjectDisposedException)
        {
            _logger.LogInformation("Cache warmup cancelled due to service disposal");
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Cache warmup cancelled");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during cache warmup process");
        }
    }

    private async Task<bool> WaitForDatabaseAsync(CancellationToken cancellationToken)
    {
        const int maxRetries = 5;
        const int delaySeconds = 10;

        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var translationRepository = scope.ServiceProvider.GetRequiredService<ITranslationRepository>();
                
                // Try to get supported cultures as a simple database check
                await translationRepository.GetSupportedCulturesAsync(cancellationToken);
                
                _logger.LogInformation("Database connection verified successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Database connection attempt {Attempt}/{MaxRetries} failed. Retrying in {Delay} seconds...", 
                    i + 1, maxRetries, delaySeconds);
                
                if (i < maxRetries - 1)
                {
                    await Task.Delay(TimeSpan.FromSeconds(delaySeconds), cancellationToken);
                }
            }
        }

        _logger.LogError("Failed to connect to database after {MaxRetries} attempts", maxRetries);
        return false;
    }
}

public class TranslationCacheWarmupOptions
{
    public const string SectionName = "TranslationCacheWarmup";

    public bool EnableBackgroundWarmup { get; set; } = true;
    public int WarmupIntervalHours { get; set; } = 6;
    public int MaxFeaturesPerCulture { get; set; } = 20;
    public int DelayBetweenRequestsMs { get; set; } = 100;
}