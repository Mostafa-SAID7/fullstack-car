using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Queries;

public class GetSupportedCulturesQuery : IRequest<IEnumerable<string>>
{
}

public class GetSupportedCulturesQueryHandler : IRequestHandler<GetSupportedCulturesQuery, IEnumerable<string>>
{
    private readonly ITranslationRepository _translationRepository;

    public GetSupportedCulturesQueryHandler(ITranslationRepository translationRepository)
    {
        _translationRepository = translationRepository;
    }

    public async Task<IEnumerable<string>> Handle(GetSupportedCulturesQuery request, CancellationToken cancellationToken)
    {
        return await _translationRepository.GetSupportedCulturesAsync(cancellationToken);
    }
}