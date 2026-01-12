using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Queries;

public class GetTranslationCacheMetricsQuery : IRequest<TranslationCacheMetrics>
{
}

public class GetTranslationCacheMetricsQueryHandler : IRequestHandler<GetTranslationCacheMetricsQuery, TranslationCacheMetrics>
{
    private readonly ITranslationCacheMetricsService _metricsService;
    private readonly ILogger<GetTranslationCacheMetricsQueryHandler> _logger;

    public GetTranslationCacheMetricsQueryHandler(
        ITranslationCacheMetricsService metricsService,
        ILogger<GetTranslationCacheMetricsQueryHandler> logger)
    {
        _metricsService = metricsService;
        _logger = logger;
    }

    public async Task<TranslationCacheMetrics> Handle(GetTranslationCacheMetricsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving translation cache metrics");

        var metrics = await _metricsService.GetMetricsAsync(cancellationToken);

        _logger.LogDebug("Retrieved cache metrics - Total Requests: {TotalRequests}, Hit Rate: {HitRate}%", 
            metrics.TotalRequests, metrics.OverallCacheHitRate);

        return metrics;
    }
}