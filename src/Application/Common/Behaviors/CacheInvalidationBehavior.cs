using Application.Features.Shared.Interfaces.Caching;
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

            if (request.CacheTags != null && request.CacheTags.Length > 0)
            {
                foreach (var tag in request.CacheTags)
                {
                    _logger.LogInformation("Invalidating cache for tag: {Tag}", tag);
                    await _cacheService.RemoveByTagAsync(tag, cancellationToken);
                }
            }

            return response;
        }
    }
}
