using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Commands;

public class InvalidateTranslationCacheCommand : IRequest<Unit>
{
    public string? Culture { get; set; }
    public string? Feature { get; set; }
}

public class InvalidateTranslationCacheCommandHandler : IRequestHandler<InvalidateTranslationCacheCommand, Unit>
{
    private readonly ITranslationRepository _translationRepository;
    private readonly ILogger<InvalidateTranslationCacheCommandHandler> _logger;

    public InvalidateTranslationCacheCommandHandler(
        ITranslationRepository translationRepository,
        ILogger<InvalidateTranslationCacheCommandHandler> logger)
    {
        _translationRepository = translationRepository;
        _logger = logger;
    }

    public async Task<Unit> Handle(InvalidateTranslationCacheCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Invalidating translation cache for culture: {Culture}, feature: {Feature}", 
            request.Culture ?? "all", request.Feature ?? "all");

        await _translationRepository.InvalidateCacheAsync(request.Culture, request.Feature, cancellationToken);

        _logger.LogInformation("Successfully invalidated translation cache for culture: {Culture}, feature: {Feature}", 
            request.Culture ?? "all", request.Feature ?? "all");

        return Unit.Value;
    }
}