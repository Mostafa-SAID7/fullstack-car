using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface ISearchOptimizationService
{
    Task<Result<bool>> OptimizeSearchIndexAsync();
    Task<Result<Dictionary<string, object>>> GetSearchPerformanceStatsAsync();
    Task<Result<bool>> RebuildSearchIndexAsync();
    Task<Result<bool>> UpdateSearchCacheAsync();
}