using Application.Features.Shared.Security.Models;

namespace Application.Features.Shared.Security.Interfaces
{
    public interface IRateLimitingService
    {
        Task<RateLimitResult> CheckRateLimitAsync(string key, RateLimitRule rule, CancellationToken cancellationToken = default);
        Task<RateLimitResult> CheckRateLimitAsync(string key, string ruleName, CancellationToken cancellationToken = default);
        Task ResetRateLimitAsync(string key, CancellationToken cancellationToken = default);
        Task<RateLimitStatus> GetRateLimitStatusAsync(string key, CancellationToken cancellationToken = default);
        Task<List<RateLimitRule>> GetRateLimitRulesAsync(CancellationToken cancellationToken = default);
        Task<bool> AddRateLimitRuleAsync(RateLimitRule rule, CancellationToken cancellationToken = default);
        Task<bool> UpdateRateLimitRuleAsync(string ruleName, RateLimitRule rule, CancellationToken cancellationToken = default);
        Task<bool> DeleteRateLimitRuleAsync(string ruleName, CancellationToken cancellationToken = default);
    }
}
