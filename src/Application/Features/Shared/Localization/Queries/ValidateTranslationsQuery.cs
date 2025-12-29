using MediatR;
using Application.Common.Interfaces.Localization;

namespace Application.Features.Shared.Localization.Queries
{
    public class ValidateTranslationsQuery : IRequest<object>
    {
        public string Language { get; set; } = string.Empty;
    }

    public class ValidateTranslationsQueryHandler : IRequestHandler<ValidateTranslationsQuery, object>
    {
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public ValidateTranslationsQueryHandler(
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        public async Task<object> Handle(ValidateTranslationsQuery request, CancellationToken cancellationToken)
        {
            if (!await _languageDetector.IsLanguageSupportedAsync(request.Language))
            {
                throw new ArgumentException($"Unsupported language: {request.Language}");
            }

            var baseResources = await _localizationProvider.GetResourcesAsync("en-US");
            var targetResources = await _localizationProvider.GetResourcesAsync(request.Language);
            
            var missingKeys = baseResources.Keys.Except(targetResources.Keys).ToList();
            var extraKeys = targetResources.Keys.Except(baseResources.Keys).ToList();
            
            return new {
                Language = request.Language,
                TotalKeys = baseResources.Count,
                TranslatedKeys = targetResources.Count,
                MissingKeys = missingKeys,
                ExtraKeys = extraKeys,
                CompletionPercentage = baseResources.Count > 0 
                    ? Math.Round((double)targetResources.Count / baseResources.Count * 100, 2) 
                    : 100.0
            };
        }
    }
}
