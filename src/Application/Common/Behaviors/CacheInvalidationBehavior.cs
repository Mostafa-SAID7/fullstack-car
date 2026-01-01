using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Common.Behaviors
{
    public class CacheInvalidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : ICacheInvalidatorRequest
    {
        private readonly ICacheService _cacheService;
        private readonly ILogger<CacheInvalidationBehavior<TRequest, TResponse>> _logger;

        public CacheInvalidationBehavior(ICacheService cacheService, ILogger<CacheInvalidationBehavior<TRequest, TResponse>> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var response = await next();

            if (request.CacheTagsToInvalidate != null && request.CacheTagsToInvalidate.Length > 0)
            {
                foreach (var tag in request.CacheTagsToInvalidate)
                {
                    _logger.LogInformation("Invalidating cache for tag: {Tag}", tag);
                    await _cacheService.RemoveByTagAsync(tag, cancellationToken);
                }
            }

            if (request.CacheKeysToInvalidate != null && request.CacheKeysToInvalidate.Length > 0)
            {
                foreach (var key in request.CacheKeysToInvalidate)
                {
                    _logger.LogInformation("Invalidating cache for key: {Key}", key);
                    await _cacheService.RemoveAsync(key, cancellationToken);
                }
            }

            return response;
        }
    }
}
