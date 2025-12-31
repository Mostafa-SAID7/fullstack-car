using MediatR;
using Application.Features.Shared.Localization.Interfaces;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetCultureInfoQuery : IRequest<object>
    {
        public string Language { get; set; } = string.Empty;
    }

    public class GetCultureInfoQueryHandler : IRequestHandler<GetCultureInfoQuery, object>
    {
        private readonly ILanguageDetector _languageDetector;
        private readonly ICultureInfoProvider _cultureInfoProvider;

        public GetCultureInfoQueryHandler(
            ILanguageDetector languageDetector,
            ICultureInfoProvider cultureInfoProvider)
        {
            _languageDetector = languageDetector;
            _cultureInfoProvider = cultureInfoProvider;
        }

        public async Task<object> Handle(GetCultureInfoQuery request, CancellationToken cancellationToken)
        {
             if (!await _languageDetector.IsLanguageSupportedAsync(request.Language))
            {
                throw new ArgumentException($"Unsupported language: {request.Language}");
            }

            return await _cultureInfoProvider.GetCultureInfoAsync(request.Language);
        }
    }
}
