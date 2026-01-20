using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface IConnectionOptimizationService
{
    Task<Result<bool>> OptimizeConnectionPoolAsync();
    Task<Result<Dictionary<string, object>>> GetConnectionStatsAsync();
    Task<Result<bool>> CleanupStaleConnectionsAsync();
    Task<Result<int>> GetActiveConnectionCountAsync();
}