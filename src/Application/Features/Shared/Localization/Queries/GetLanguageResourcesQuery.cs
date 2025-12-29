using MediatR;
using Application.Common.Interfaces.Localization;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetLanguageResourcesQuery : IRequest<object>
    {
        public string Language { get; set; } = string.Empty;
    }

    public class GetLanguageResourcesQueryHandler : IRequestHandler<GetLanguageResourcesQuery, object>
    {
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public GetLanguageResourcesQueryHandler(
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        public async Task<object> Handle(GetLanguageResourcesQuery request, CancellationToken cancellationToken)
        {
            if (!await _languageDetector.IsLanguageSupportedAsync(request.Language))
            {
                throw new ArgumentException($"Unsupported language: {request.Language}");
            }

            var resources = await _localizationProvider.GetResourcesAsync(request.Language);

            return new
            {
                Language = request.Language,
                Resources = resources,
                Direction = request.Language.StartsWith("ar-") ? "rtl" : "ltr", // Simple logic, could use CultureInfoProvider too
                LoadedAt = DateTime.UtcNow
            };
        }
    }
}
