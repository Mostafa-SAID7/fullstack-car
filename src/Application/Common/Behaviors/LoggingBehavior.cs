using Application.Features.Shared.Logging.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using global::System.Text.Json;
using System.Diagnostics;

namespace Application.Common.Behaviors
{
    public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly IAppLogger<LoggingBehavior<TRequest, TResponse>> _logger;

        public LoggingBehavior(IAppLogger<LoggingBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;
            var uniqueId = Guid.NewGuid().ToString();

            _logger.LogInformation("MediatR Request: {Name} {Id} {@Request}",
                requestName, uniqueId, request);

            var timer = Stopwatch.StartNew();
            try
            {
                var response = await next();
                timer.Stop();

                _logger.LogInformation("MediatR Response: {Name} {Id} took {ElapsedMilliseconds}ms",
                    requestName, uniqueId, timer.ElapsedMilliseconds);

                return response;
            }
            catch (Exception ex)
            {
                timer.Stop();
                _logger.LogError(ex, "MediatR Request Error: {Name} {Id} after {ElapsedMilliseconds}ms",
                    requestName, uniqueId, timer.ElapsedMilliseconds);
                throw;
            }
        }
    }
}
