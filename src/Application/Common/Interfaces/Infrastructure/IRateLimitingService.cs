namespace Application.Common.Interfaces.Infrastructure
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

    public class RateLimitRule
    {
        public string Name { get; set; } = string.Empty;
        public int Limit { get; set; }
        public TimeSpan Period { get; set; }
        public string Endpoint { get; set; } = "*";
        public string HttpMethod { get; set; } = "*";
        public List<string> IpWhitelist { get; set; } = new();
        public List<string> IpBlacklist { get; set; } = new();
        public List<string> UserRoles { get; set; } = new();
        public bool EnableQuotaExceededResponse { get; set; } = true;
        public string QuotaExceededMessage { get; set; } = "Rate limit exceeded";
        public int QuotaExceededStatusCode { get; set; } = 429;
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class RateLimitResult
    {
        public bool IsAllowed { get; set; }
        public int RemainingRequests { get; set; }
        public TimeSpan RetryAfter { get; set; }
        public DateTime ResetTime { get; set; }
        public string RuleName { get; set; } = string.Empty;
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class RateLimitStatus
    {
        public string Key { get; set; } = string.Empty;
        public int CurrentRequests { get; set; }
        public int MaxRequests { get; set; }
        public TimeSpan Period { get; set; }
        public DateTime WindowStart { get; set; }
        public DateTime WindowEnd { get; set; }
        public List<DateTime> RequestTimestamps { get; set; } = new();
    }
}