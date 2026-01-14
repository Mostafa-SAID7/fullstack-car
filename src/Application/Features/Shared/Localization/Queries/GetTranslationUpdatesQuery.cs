using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Queries;

public class GetTranslationUpdatesQuery : IRequest<IEnumerable<object>>
{
    public string Culture { get; set; } = string.Empty;
    public IEnumerable<string> Features { get; set; } = Enumerable.Empty<string>();
    public DateTime Since { get; set; }
}

public class GetTranslationUpdatesQueryHandler : IRequestHandler<GetTranslationUpdatesQuery, IEnumerable<object>>
{
    private readonly ITranslationRepository _repository;

    public GetTranslationUpdatesQueryHandler(ITranslationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<object>> Handle(GetTranslationUpdatesQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Culture))
            throw new ArgumentException("Culture is required", nameof(request.Culture));

        return await _repository.GetTranslationUpdatesAsync(request.Culture, request.Features, request.Since, cancellationToken);
    }
}
