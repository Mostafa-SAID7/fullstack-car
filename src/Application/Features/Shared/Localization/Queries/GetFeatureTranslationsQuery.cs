using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Queries;

public class GetFeatureTranslationsQuery : IRequest<Dictionary<string, string>>
{
    public string Culture { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
}

public class GetFeatureTranslationsQueryHandler : IRequestHandler<GetFeatureTranslationsQuery, Dictionary<string, string>>
{
    private readonly ITranslationRepository _translationRepository;

    public GetFeatureTranslationsQueryHandler(ITranslationRepository translationRepository)
    {
        _translationRepository = translationRepository;
    }

    public async Task<Dictionary<string, string>> Handle(GetFeatureTranslationsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Culture))
            throw new ArgumentException("Culture is required", nameof(request.Culture));

        if (string.IsNullOrWhiteSpace(request.Feature))
            throw new ArgumentException("Feature is required", nameof(request.Feature));

        return await _translationRepository.GetTranslationsAsync(request.Culture, request.Feature, cancellationToken);
    }
}