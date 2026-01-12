using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Commands;

public class WarmTranslationCacheCommand : IRequest<Dictionary<string, bool>>
{
    public string Culture { get; set; } = string.Empty;
    public IEnumerable<string> Features { get; set; } = Enumerable.Empty<string>();
}

public class WarmTranslationCacheCommandHandler : IRequestHandler<WarmTranslationCacheCommand, Dictionary<string, bool>>
{
    private readonly ITranslationRepository _translationRepository;
    private readonly ILogger<WarmTranslationCacheCommandHandler> _logger;

    public WarmTranslationCacheCommandHandler(
        ITranslationRepository translationRepository,
        ILogger<WarmTranslationCacheCommandHandler> logger)
    {
        _translationRepository = translationRepository;
        _logger = logger;
    }

    public async Task<Dictionary<string, bool>> Handle(WarmTranslationCacheCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Culture))
        {
            throw new ArgumentException("Culture is required for cache warming");
        }

        if (!request.Features.Any())
        {
            throw new ArgumentException("At least one feature is required for cache warming");
        }

        _logger.LogInformation("Warming translation cache for culture: {Culture}, features: {Features}", 
            request.Culture, string.Join(", ", request.Features));

        var results = new Dictionary<string, bool>();

        foreach (var feature in request.Features)
        {
            try
            {
                // Pre-load translations into cache
                var translations = await _translationRepository.GetTranslationsAsync(request.Culture, feature, cancellationToken);
                results[feature] = translations.Any();
                
                _logger.LogDebug("Successfully warmed cache for culture: {Culture}, feature: {Feature}, keys: {KeyCount}", 
                    request.Culture, feature, translations.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to warm cache for culture: {Culture}, feature: {Feature}", 
                    request.Culture, feature);
                results[feature] = false;
            }
        }

        var successCount = results.Values.Count(success => success);
        _logger.LogInformation("Cache warming completed for culture: {Culture}. Success: {SuccessCount}/{TotalCount}", 
            request.Culture, successCount, results.Count);

        return results;
    }
}