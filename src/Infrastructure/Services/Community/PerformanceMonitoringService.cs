using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.Community;

public class PerformanceMonitoringService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<PerformanceMonitoringService> _logger;
    private readonly PerformanceMonitoringOptions _options;

    public PerformanceMonitoringService(
        IServiceProvider serviceProvider,
        ILogger<PerformanceMonitoringService> logger,
        IOptions<PerformanceMonitoringOptions> options)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Performance Monitoring Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PerformMonitoringCycleAsync(stoppingToken);
                await Task.Delay(TimeSpan.FromMinutes(_options.MonitoringIntervalMinutes), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QA performance monitoring cycle");
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Brief delay before retry
            }
        }

        _logger.LogInformation("Performance Monitoring Service stopped");
    }

    private async Task PerformMonitoringCycleAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        
        try
        {
            // Monitor database performance
            if (_options.EnableDatabaseMonitoring)
            {
                await MonitorDatabasePerformanceAsync(scope, cancellationToken);
            }

            // Monitor search performance
            if (_options.EnableSearchMonitoring)
            {
                await MonitorSearchPerformanceAsync(scope, cancellationToken);
            }

            // Monitor SignalR connections
            if (_options.EnableConnectionMonitoring)
            {
                await MonitorConnectionPerformanceAsync(scope, cancellationToken);
            }

            // Monitor CDN performance
            if (_options.EnableCdnMonitoring)
            {
                await MonitorCdnPerformanceAsync(scope, cancellationToken);
            }

            // Perform optimization tasks
            if (_options.EnableAutoOptimization)
            {
                await PerformAutoOptimizationAsync(scope, cancellationToken);
            }

            // Generate performance report
            if (_options.EnablePerformanceReporting)
            {
                await GeneratePerformanceReportAsync(scope, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during performance monitoring cycle");
        }
    }

    private async Task MonitorDatabasePerformanceAsync(IServiceScope scope, CancellationToken cancellationToken)
    {
        try
        {
            var queryOptimizationService = scope.ServiceProvider.GetService<IQueryOptimizationService>();
            if (queryOptimizationService == null) return;

            // Get query performance metrics
            var metrics = await queryOptimizationService.GetQueryPerformanceMetricsAsync("overall", cancellationToken);
            
            // Check if performance is below threshold
            if (metrics.AverageExecutionTimeMs > _options.DatabasePerformanceThresholdMs)
            {
                _logger.LogWarning("Database performance below threshold: {AverageMs}ms (threshold: {ThresholdMs}ms)",
                    metrics.AverageExecutionTimeMs, _options.DatabasePerformanceThresholdMs);

                // Trigger optimization if enabled
                if (_options.EnableAutoOptimization)
                {
                    await queryOptimizationService.OptimizeDatabaseAsync(cancellationToken);
                    _logger.LogInformation("Triggered database optimization due to performance issues");
                }
            }

            _logger.LogDebug("Database performance monitoring completed - Average: {AverageMs}ms", 
                metrics.AverageExecutionTimeMs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error monitoring database performance");
        }
    }

    private async Task MonitorSearchPerformanceAsync(IServiceScope scope, CancellationToken cancellationToken)
    {
        try
        {
            var searchOptimizationService = scope.ServiceProvider.GetService<ISearchOptimizationService>();
            if (searchOptimizationService == null) return;

            // Get search performance metrics
            var metrics = await searchOptimizationService.GetSearchMetricsAsync(cancellationToken);
            
            // Check if search performance is below threshold
            if (metrics.AverageResponseTime > _options.SearchPerformanceThresholdMs)
            {
                _logger.LogWarning("Search performance below threshold: {AverageMs}ms (threshold: {ThresholdMs}ms)",
                    metrics.AverageResponseTime, _options.SearchPerformanceThresholdMs);

                // Trigger search optimization if enabled
                if (_options.EnableAutoOptimization)
                {
                    await searchOptimizationService.OptimizeSearchIndexesAsync(cancellationToken);
                    _logger.LogInformation("Triggered search optimization due to performance issues");
                }
            }

            // Check cache hit rate
            if (metrics.CacheHitRate < _options.MinCacheHitRate)
            {
                _logger.LogWarning("Search cache hit rate below threshold: {CacheHitRate}% (threshold: {ThresholdRate}%)",
                    metrics.CacheHitRate, _options.MinCacheHitRate);

                // Prewarm cache if enabled
                if (_options.EnableAutoOptimization)
                {
                    await searchOptimizationService.PrewarmSearchCacheAsync(cancellationToken);
                    _logger.LogInformation("Triggered search cache prewarming due to low hit rate");
                }
            }

            _logger.LogDebug("Search performance monitoring completed - Average: {AverageMs}ms, Cache Hit Rate: {CacheHitRate}%", 
                metrics.AverageResponseTime, metrics.CacheHitRate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error monitoring search performance");
        }
    }

    private async Task MonitorConnectionPerformanceAsync(IServiceScope scope, CancellationToken cancellationToken)
    {
        try
        {
            var connectionOptimizationService = scope.ServiceProvider.GetService<IConnectionOptimizationService>();
            if (connectionOptimizationService == null) return;

            // Get connection performance metrics
            var metrics = await connectionOptimizationService.GetConnectionMetricsAsync(cancellationToken);
            
            // Check connection load
            if (metrics.CurrentConnections > _options.MaxConnectionsThreshold)
            {
                _logger.LogWarning("High connection load detected: {CurrentConnections} connections (threshold: {ThresholdConnections})",
                    metrics.CurrentConnections, _options.MaxConnectionsThreshold);

                // Trigger connection optimization if enabled
                if (_options.EnableAutoOptimization)
                {
                    await connectionOptimizationService.HandleConnectionLoadAsync(metrics.CurrentConnections, cancellationToken);
                    _logger.LogInformation("Triggered connection load optimization");
                }
            }

            // Cleanup stale connections
            if (_options.EnableAutoOptimization)
            {
                await connectionOptimizationService.CleanupStaleConnectionsAsync(cancellationToken);
            }

            _logger.LogDebug("Connection performance monitoring completed - Current: {CurrentConnections}, Peak: {PeakConnections}", 
                metrics.CurrentConnections, metrics.PeakConnections);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error monitoring connection performance");
        }
    }

    private async Task MonitorCdnPerformanceAsync(IServiceScope scope, CancellationToken cancellationToken)
    {
        try
        {
            var cdnOptimizationService = scope.ServiceProvider.GetService<ICdnOptimizationService>();
            if (cdnOptimizationService == null) return;

            // Get CDN performance metrics
            var metrics = await cdnOptimizationService.GetCdnMetricsAsync(cancellationToken);
            
            // Check CDN response time
            if (metrics.AverageResponseTime > _options.CdnPerformanceThresholdMs)
            {
                _logger.LogWarning("CDN performance below threshold: {AverageMs}ms (threshold: {ThresholdMs}ms)",
                    metrics.AverageResponseTime, _options.CdnPerformanceThresholdMs);

                // Trigger CDN optimization if enabled
                if (_options.EnableAutoOptimization)
                {
                    await cdnOptimizationService.OptimizeCdnConfigurationAsync(cancellationToken);
                    _logger.LogInformation("Triggered CDN optimization due to performance issues");
                }
            }

            // Check cache hit rate
            if (metrics.CacheHitRate < _options.MinCdnCacheHitRate)
            {
                _logger.LogWarning("CDN cache hit rate below threshold: {CacheHitRate}% (threshold: {ThresholdRate}%)",
                    metrics.CacheHitRate, _options.MinCdnCacheHitRate);

                // Preload critical assets if enabled
                if (_options.EnableAutoOptimization)
                {
                    await cdnOptimizationService.PreloadCriticalAssetsAsync(cancellationToken);
                    _logger.LogInformation("Triggered CDN asset preloading due to low cache hit rate");
                }
            }

            _logger.LogDebug("CDN performance monitoring completed - Average: {AverageMs}ms, Cache Hit Rate: {CacheHitRate}%", 
                metrics.AverageResponseTime, metrics.CacheHitRate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error monitoring CDN performance");
        }
    }

    private async Task PerformAutoOptimizationAsync(IServiceScope scope, CancellationToken cancellationToken)
    {
        try
        {
            // Perform scheduled optimizations
            if (ShouldPerformDatabaseOptimization())
            {
                var queryOptimizationService = scope.ServiceProvider.GetService<IQueryOptimizationService>();
                if (queryOptimizationService != null)
                {
                    await queryOptimizationService.UpdateQueryStatisticsAsync(cancellationToken);
                    _logger.LogDebug("Performed scheduled database statistics update");
                }
            }

            if (ShouldPerformSearchOptimization())
            {
                var searchOptimizationService = scope.ServiceProvider.GetService<ISearchOptimizationService>();
                if (searchOptimizationService != null)
                {
                    await searchOptimizationService.PrewarmSearchCacheAsync(cancellationToken);
                    _logger.LogDebug("Performed scheduled search cache prewarming");
                }
            }

            if (ShouldPerformCdnOptimization())
            {
                var cdnOptimizationService = scope.ServiceProvider.GetService<ICdnOptimizationService>();
                if (cdnOptimizationService != null)
                {
                    await cdnOptimizationService.PreloadCriticalAssetsAsync(cancellationToken);
                    _logger.LogDebug("Performed scheduled CDN asset preloading");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing auto optimization");
        }
    }

    private async Task GeneratePerformanceReportAsync(IServiceScope scope, CancellationToken cancellationToken)
    {
        try
        {
            var report = new PerformanceReport
            {
                GeneratedAt = DateTime.UtcNow,
                MonitoringPeriod = TimeSpan.FromMinutes(_options.MonitoringIntervalMinutes)
            };

            // Collect metrics from all services
            var queryOptimizationService = scope.ServiceProvider.GetService<IQueryOptimizationService>();
            if (queryOptimizationService != null)
            {
                report.DatabaseMetrics = await queryOptimizationService.GetQueryPerformanceMetricsAsync("overall", cancellationToken);
            }

            var searchOptimizationService = scope.ServiceProvider.GetService<ISearchOptimizationService>();
            if (searchOptimizationService != null)
            {
                report.SearchMetrics = await searchOptimizationService.GetSearchMetricsAsync(cancellationToken);
            }

            var connectionOptimizationService = scope.ServiceProvider.GetService<IConnectionOptimizationService>();
            if (connectionOptimizationService != null)
            {
                report.ConnectionMetrics = await connectionOptimizationService.GetConnectionMetricsAsync(cancellationToken);
            }

            var cdnOptimizationService = scope.ServiceProvider.GetService<ICdnOptimizationService>();
            if (cdnOptimizationService != null)
            {
                report.CdnMetrics = await cdnOptimizationService.GetCdnMetricsAsync(cancellationToken);
            }

            // Log performance summary
            _logger.LogInformation("Performance Report - DB: {DbAvg}ms, Search: {SearchAvg}ms, Connections: {Connections}, CDN: {CdnAvg}ms",
                report.DatabaseMetrics?.AverageExecutionTimeMs ?? 0,
                report.SearchMetrics?.AverageResponseTime ?? 0,
                report.ConnectionMetrics?.CurrentConnections ?? 0,
                report.CdnMetrics?.AverageResponseTime ?? 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating performance report");
        }
    }

    private bool ShouldPerformDatabaseOptimization()
    {
        // Perform database optimization every 6 hours
        return DateTime.UtcNow.Hour % 6 == 0 && DateTime.UtcNow.Minute < _options.MonitoringIntervalMinutes;
    }

    private bool ShouldPerformSearchOptimization()
    {
        // Perform search optimization every 4 hours
        return DateTime.UtcNow.Hour % 4 == 0 && DateTime.UtcNow.Minute < _options.MonitoringIntervalMinutes;
    }

    private bool ShouldPerformCdnOptimization()
    {
        // Perform CDN optimization every 8 hours
        return DateTime.UtcNow.Hour % 8 == 0 && DateTime.UtcNow.Minute < _options.MonitoringIntervalMinutes;
    }
}

public class PerformanceReport
{
    public DateTime GeneratedAt { get; set; }
    public TimeSpan MonitoringPeriod { get; set; }
    public QueryPerformanceMetrics? DatabaseMetrics { get; set; }
    public SearchPerformanceMetrics? SearchMetrics { get; set; }
    public ConnectionPerformanceMetrics? ConnectionMetrics { get; set; }
    public CdnPerformanceMetrics? CdnMetrics { get; set; }
}

public class PerformanceMonitoringOptions
{
    public const string SectionName = "PerformanceMonitoring";
    
    public bool EnableDatabaseMonitoring { get; set; } = true;
    public bool EnableSearchMonitoring { get; set; } = true;
    public bool EnableConnectionMonitoring { get; set; } = true;
    public bool EnableCdnMonitoring { get; set; } = true;
    public bool EnableAutoOptimization { get; set; } = true;
    public bool EnablePerformanceReporting { get; set; } = true;
    
    public int MonitoringIntervalMinutes { get; set; } = 5;
    public int DatabasePerformanceThresholdMs { get; set; } = 200; // As per requirements
    public int SearchPerformanceThresholdMs { get; set; } = 2000; // As per requirements
    public int CdnPerformanceThresholdMs { get; set; } = 100;
    public int MaxConnectionsThreshold { get; set; } = 1000;
    
    public double MinCacheHitRate { get; set; } = 80.0;
    public double MinCdnCacheHitRate { get; set; } = 90.0;
}
