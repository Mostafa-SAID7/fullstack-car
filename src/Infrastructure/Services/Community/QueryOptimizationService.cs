using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics;

namespace Infrastructure.Services.Community;

public interface IQueryOptimizationService
{
    Task<T> ExecuteOptimizedQueryAsync<T>(Func<Task<T>> query, string queryName, CancellationToken cancellationToken = default);
    Task OptimizeDatabaseAsync(CancellationToken cancellationToken = default);
    Task<QueryPerformanceMetrics> GetQueryPerformanceMetricsAsync(string queryName, CancellationToken cancellationToken = default);
    Task UpdateQueryStatisticsAsync(CancellationToken cancellationToken = default);
}

public class QueryOptimizationService : IQueryOptimizationService
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<QueryOptimizationService> _logger;
    private readonly PerformanceOptions _options;
    private readonly Dictionary<string, QueryPerformanceMetrics> _queryMetrics;

    public QueryOptimizationService(
        IApplicationDbContext context,
        ILogger<QueryOptimizationService> logger,
        IOptions<PerformanceOptions> options)
    {
        _context = context;
        _logger = logger;
        _options = options.Value;
        _queryMetrics = new Dictionary<string, QueryPerformanceMetrics>();
    }

    public async Task<T> ExecuteOptimizedQueryAsync<T>(Func<Task<T>> query, string queryName, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            // Set query timeout for performance requirements
            if (_context is DbContext dbContext)
            {
                dbContext.Database.SetCommandTimeout(TimeSpan.FromMilliseconds(_options.QueryTimeoutMs));
            }

            var result = await query();
            
            stopwatch.Stop();
            
            // Track performance metrics
            await UpdateQueryMetricsAsync(queryName, stopwatch.ElapsedMilliseconds, true);
            
            // Log slow queries
            if (stopwatch.ElapsedMilliseconds > _options.SlowQueryThresholdMs)
            {
                _logger.LogWarning("Slow query detected: {QueryName} took {ElapsedMs}ms", 
                    queryName, stopwatch.ElapsedMilliseconds);
            }
            
            return result;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            await UpdateQueryMetricsAsync(queryName, stopwatch.ElapsedMilliseconds, false);
            
            _logger.LogError(ex, "Query failed: {QueryName} after {ElapsedMs}ms", 
                queryName, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }

    public async Task OptimizeDatabaseAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting database optimization");

            if (_context is not DbContext dbContext)
            {
                _logger.LogWarning("Cannot optimize database - context is not DbContext");
                return;
            }

            // Update statistics for tables
            var tables = new[]
            {
                "Questions", "Answers", "Votes", "UserReputation", 
                "Experts", "Categories", "Tags", "QuestionTags",
                "Analytics", "UserActivities"
            };

            foreach (var table in tables)
            {
                try
                {
                    await dbContext.Database.ExecuteSqlRawAsync(
                        $"UPDATE STATISTICS {table} WITH FULLSCAN", 
                        cancellationToken);
                    
                    _logger.LogDebug("Updated statistics for table: {TableName}", table);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to update statistics for table: {TableName}", table);
                }
            }

            // Reorganize indexes for better performance
            foreach (var table in tables)
            {
                try
                {
                    await dbContext.Database.ExecuteSqlRawAsync(
                        $"ALTER INDEX ALL ON {table} REORGANIZE", 
                        cancellationToken);
                    
                    _logger.LogDebug("Reorganized indexes for table: {TableName}", table);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to reorganize indexes for table: {TableName}", table);
                }
            }

            _logger.LogInformation("Database optimization completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database optimization failed");
            throw;
        }
    }

    public async Task<QueryPerformanceMetrics> GetQueryPerformanceMetricsAsync(string queryName, CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask; // Async for future database storage
        
        if (_queryMetrics.TryGetValue(queryName, out var metrics))
        {
            return metrics;
        }

        return new QueryPerformanceMetrics
        {
            QueryName = queryName,
            ExecutionCount = 0,
            AverageExecutionTimeMs = 0,
            MaxExecutionTimeMs = 0,
            MinExecutionTimeMs = 0,
            SuccessRate = 0,
            LastExecuted = null
        };
    }

    public async Task UpdateQueryStatisticsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (_context is not DbContext dbContext)
            {
                return;
            }

            // Update query store statistics if available
            await dbContext.Database.ExecuteSqlRawAsync(
                "EXEC sp_query_store_flush_db", 
                cancellationToken);

            _logger.LogDebug("Query statistics updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to update query statistics");
        }
    }

    private async Task UpdateQueryMetricsAsync(string queryName, long executionTimeMs, bool success)
    {
        await Task.CompletedTask; // Async for future database storage

        if (!_queryMetrics.TryGetValue(queryName, out var metrics))
        {
            metrics = new QueryPerformanceMetrics
            {
                QueryName = queryName,
                ExecutionCount = 0,
                TotalExecutionTimeMs = 0,
                MaxExecutionTimeMs = 0,
                MinExecutionTimeMs = long.MaxValue,
                SuccessCount = 0
            };
            _queryMetrics[queryName] = metrics;
        }

        metrics.ExecutionCount++;
        metrics.TotalExecutionTimeMs += executionTimeMs;
        metrics.MaxExecutionTimeMs = Math.Max(metrics.MaxExecutionTimeMs, executionTimeMs);
        metrics.MinExecutionTimeMs = Math.Min(metrics.MinExecutionTimeMs, executionTimeMs);
        metrics.LastExecuted = DateTime.UtcNow;

        if (success)
        {
            metrics.SuccessCount++;
        }

        // Calculate derived metrics
        metrics.AverageExecutionTimeMs = metrics.TotalExecutionTimeMs / metrics.ExecutionCount;
        metrics.SuccessRate = (double)metrics.SuccessCount / metrics.ExecutionCount * 100;
    }
}

public class QueryPerformanceMetrics
{
    public string QueryName { get; set; } = string.Empty;
    public long ExecutionCount { get; set; }
    public long TotalExecutionTimeMs { get; set; }
    public long AverageExecutionTimeMs { get; set; }
    public long MaxExecutionTimeMs { get; set; }
    public long MinExecutionTimeMs { get; set; }
    public long SuccessCount { get; set; }
    public double SuccessRate { get; set; }
    public DateTime? LastExecuted { get; set; }
}

public class PerformanceOptions
{
    public const string SectionName = "Performance";
    
    public int QueryTimeoutMs { get; set; } = 30000; // 30 seconds
    public int SlowQueryThresholdMs { get; set; } = 200; // 200ms as per requirements
    public bool EnableQueryOptimization { get; set; } = true;
    public bool EnablePerformanceLogging { get; set; } = true;
    public int StatisticsUpdateIntervalHours { get; set; } = 24;
    public int IndexMaintenanceIntervalHours { get; set; } = 168; // Weekly
}
