using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface IQueryOptimizationService
{
    Task<Result<bool>> OptimizeQueriesAsync();
    Task<Result<Dictionary<string, object>>> GetQueryPerformanceStatsAsync();
    Task<Result<bool>> CreateIndexesAsync();
    Task<Result<bool>> UpdateStatisticsAsync();
    Task<Result<List<string>>> GetSlowQueriesAsync();
}