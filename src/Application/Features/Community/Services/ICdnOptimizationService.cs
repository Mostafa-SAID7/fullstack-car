using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface ICdnOptimizationService
{
    Task<Result<bool>> OptimizeCdnCacheAsync();
    Task<Result<Dictionary<string, object>>> GetCdnStatsAsync();
    Task<Result<bool>> PurgeExpiredCacheAsync();
    Task<Result<string>> GetOptimizedUrlAsync(string originalUrl);
}