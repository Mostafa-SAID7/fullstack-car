using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Queries;

public class GetBatchTranslationsQuery : IRequest<Dictionary<string, Dictionary<string, string>>>
{
    public string Culture { get; set; } = string.Empty;
    public IEnumerable<string> Features { get; set; } = Enumerable.Empty<string>();
}

public class GetBatchTranslationsQueryHandler : IRequestHandler<GetBatchTranslationsQuery, Dictionary<string, Dictionary<string, string>>>
{
    private readonly ITranslationRepository _translationRepository;

    public GetBatchTranslationsQueryHandler(ITranslationRepository translationRepository)
    {
        _translationRepository = translationRepository;
    }

    public async Task<Dictionary<string, Dictionary<string, string>>> Handle(GetBatchTranslationsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Culture))
            throw new ArgumentException("Culture is required", nameof(request.Culture));

        if (!request.Features.Any())
            throw new ArgumentException("At least one feature is required", nameof(request.Features));

        return await _translationRepository.GetBatchTranslationsAsync(request.Culture, request.Features, cancellationToken);
    }
}