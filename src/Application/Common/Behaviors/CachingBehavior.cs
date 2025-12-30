using Application.Common.Interfaces.Caching;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Behaviors
{
    public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : ICacheableRequest
        where TResponse : class
    {
        private readonly ICacheService _cacheService;
        private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

        public CachingBehavior(ICacheService cacheService, ILogger<CachingBehavior<TRequest, TResponse>> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Checking cache for {RequestName} with Key: {CacheKey}", typeof(TRequest).Name, request.CacheKey);

            var cachedResponse = await _cacheService.GetAsync<TResponse>(request.CacheKey, cancellationToken);
            if (cachedResponse != null)
            {
                _logger.LogInformation("Cache hit for {RequestName} with Key: {CacheKey}", typeof(TRequest).Name, request.CacheKey);
                return cachedResponse;
            }

            _logger.LogInformation("Cache miss for {RequestName} with Key: {CacheKey}. Fetching from source.", typeof(TRequest).Name, request.CacheKey);
            
            var response = await next();

            if (response != null)
            {
                if (!string.IsNullOrEmpty(request.CacheTag))
                {
                    await _cacheService.SetWithTagAsync(request.CacheKey, response, request.CacheTag, request.Expiration, cancellationToken);
                }
                else
                {
                    await _cacheService.SetAsync(request.CacheKey, response, request.Expiration, cancellationToken);
                }
            }

            return response;
        }
    }
}
