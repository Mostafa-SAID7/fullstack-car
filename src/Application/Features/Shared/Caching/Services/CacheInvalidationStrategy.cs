using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Caching.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Caching.Services
{
    public class CacheInvalidationStrategy : ICacheInvalidationStrategy
    {
        private readonly IAdvancedCacheService _cacheService;
        private readonly ILogger<CacheInvalidationStrategy> _logger;

        // Define cache invalidation rules
        private readonly Dictionary<string, CacheInvalidationRule> _invalidationRules = new()
        {
            ["User"] = new CacheInvalidationRule
            {
                DirectTags = new[] { "users", "user-list", "user-profile" },
                RelatedTags = new[] { "posts", "comments", "groups", "friends" },
                Patterns = new[] { "user:*", "profile:*" }
            },
            ["Post"] = new CacheInvalidationRule
            {
                DirectTags = new[] { "posts", "post-list", "community-feed" },
                RelatedTags = new[] { "comments", "user-posts", "group-posts" },
                Patterns = new[] { "post:*", "feed:*" }
            },
            ["Group"] = new CacheInvalidationRule
            {
                DirectTags = new[] { "groups", "group-list" },
                RelatedTags = new[] { "group-members", "group-posts" },
                Patterns = new[] { "group:*" }
            },
            ["Comment"] = new CacheInvalidationRule
            {
                DirectTags = new[] { "comments", "post-comments" },
                RelatedTags = new[] { "posts", "user-comments" },
                Patterns = new[] { "comment:*" }
            },
            ["Role"] = new CacheInvalidationRule
            {
                DirectTags = new[] { "roles", "user-roles", "permissions" },
                RelatedTags = new[] { "users", "authorization" },
                Patterns = new[] { "role:*", "auth:*" }
            }
        };

        public CacheInvalidationStrategy(IAdvancedCacheService cacheService, ILogger<CacheInvalidationStrategy> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task InvalidateAsync(string entityType, string entityId, CancellationToken cancellationToken = default)
        {
            try
            {
                if (_invalidationRules.TryGetValue(entityType, out var rule))
                {
                    // Invalidate direct tags
                    await _cacheService.InvalidateTagsAsync(rule.DirectTags, cancellationToken);

                    // Invalidate specific entity cache
                    var entityKey = $"{entityType.ToLower()}:{entityId}";
                    await _cacheService.RemoveAsync(entityKey, cancellationToken);

                    // Invalidate patterns
                    foreach (var pattern in rule.Patterns)
                    {
                        var specificPattern = pattern.Replace("*", entityId);
                        await _cacheService.RemoveByPatternAsync(specificPattern, cancellationToken);
                    }

                    _logger.LogInformation("Cache invalidated for {EntityType}:{EntityId}", entityType, entityId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating cache for {EntityType}:{EntityId}", entityType, entityId);
            }
        }

        public async Task InvalidateRelatedAsync(string entityType, string entityId, CancellationToken cancellationToken = default)
        {
            try
            {
                if (_invalidationRules.TryGetValue(entityType, out var rule))
                {
                    // Invalidate related tags
                    await _cacheService.InvalidateTagsAsync(rule.RelatedTags, cancellationToken);

                    _logger.LogInformation("Related cache invalidated for {EntityType}:{EntityId}", entityType, entityId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating related cache for {EntityType}:{EntityId}", entityType, entityId);
            }
        }

        public async Task InvalidateByPatternAsync(string pattern, CancellationToken cancellationToken = default)
        {
            try
            {
                await _cacheService.RemoveByPatternAsync(pattern, cancellationToken);
                _logger.LogInformation("Cache invalidated for pattern: {Pattern}", pattern);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating cache for pattern: {Pattern}", pattern);
            }
        }
    }


}
