using MediatR;
using Application.Features.Shared.Localization.Interfaces;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetCategoryResourcesQuery : IRequest<object>
    {
        public string Language { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }

    public class GetCategoryResourcesQueryHandler : IRequestHandler<GetCategoryResourcesQuery, object>
    {
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public GetCategoryResourcesQueryHandler(
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        public async Task<object> Handle(GetCategoryResourcesQuery request, CancellationToken cancellationToken)
        {
             if (!await _languageDetector.IsLanguageSupportedAsync(request.Language))
            {
                throw new ArgumentException($"Unsupported language: {request.Language}");
            }

            var resources = await _localizationProvider.GetCategoryResourcesAsync(request.Language, request.Category);

            return new
            {
                Language = request.Language,
                Category = request.Category,
                Resources = resources,
                Count = resources.Count
            };
        }
    }
}
