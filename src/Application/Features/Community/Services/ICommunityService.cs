using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface ICommunityService
{
    Task<Result<bool>> IsUserActiveAsync(Guid userId);
    Task<Result<int>> GetUserReputationAsync(Guid userId);
    Task<Result<List<string>>> GetUserBadgesAsync(Guid userId);
    Task<Result<bool>> CanUserPerformActionAsync(Guid userId, string action);
    Task<Result<Dictionary<string, object>>> GetCommunityStatsAsync();
}