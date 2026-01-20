using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface IStaticAssetOptimizationService
{
    Task<Result<bool>> OptimizeStaticAssetsAsync();
    Task<Result<Dictionary<string, object>>> GetAssetStatsAsync();
    Task<Result<bool>> CompressAssetsAsync();
    Task<Result<bool>> MinifyAssetsAsync();
}