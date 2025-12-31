using MediatR;
using Application.Features.Shared.Localization.Interfaces;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetSupportedLanguagesQuery : IRequest<IEnumerable<object>>
    {
    }

    public class GetSupportedLanguagesQueryHandler : IRequestHandler<GetSupportedLanguagesQuery, IEnumerable<object>>
    {
        private readonly ILanguageDetector _languageDetector;
        private readonly ICultureInfoProvider _cultureInfoProvider;

        public GetSupportedLanguagesQueryHandler(
            ILanguageDetector languageDetector,
            ICultureInfoProvider cultureInfoProvider)
        {
            _languageDetector = languageDetector;
            _cultureInfoProvider = cultureInfoProvider;
        }

        public async Task<IEnumerable<object>> Handle(GetSupportedLanguagesQuery request, CancellationToken cancellationToken)
        {
            var supportedLanguages = await _languageDetector.GetSupportedLanguagesAsync();
            var result = new List<object>();

            foreach (var lang in supportedLanguages)
            {
                result.Add(await _cultureInfoProvider.GetCultureInfoAsync(lang));
            }

            return result;
        }
    }
}
