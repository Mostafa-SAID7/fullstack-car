using MediatR;
using Application.Features.Shared.Localization.Interfaces;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetTranslationQuery : IRequest<object>
    {
        public string Language { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
    }

    public class GetTranslationQueryHandler : IRequestHandler<GetTranslationQuery, object>
    {
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public GetTranslationQueryHandler(
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        public async Task<object> Handle(GetTranslationQuery request, CancellationToken cancellationToken)
        {
            if (!await _languageDetector.IsLanguageSupportedAsync(request.Language))
            {
                throw new ArgumentException($"Unsupported language: {request.Language}");
            }

            var translation = await _localizationProvider.GetTranslationAsync(request.Language, request.Key);

            return new
            {
                Key = request.Key,
                Translation = translation,
                Language = request.Language,
                Found = translation != request.Key
            };
        }
    }
}
