using MediatR;
using Application.Common.Interfaces.Localization;

namespace Application.Features.Shared.Localization.Queries
{
    public class DetectLanguageQuery : IRequest<object>
    {
        public string AcceptLanguage { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
    }

    public class DetectLanguageQueryHandler : IRequestHandler<DetectLanguageQuery, object>
    {
        private readonly ILanguageDetector _languageDetector;

        public DetectLanguageQueryHandler(ILanguageDetector languageDetector)
        {
            _languageDetector = languageDetector;
        }

        public async Task<object> Handle(DetectLanguageQuery request, CancellationToken cancellationToken)
        {
            var detectedLanguage = await _languageDetector.DetectLanguageAsync(request.AcceptLanguage, request.UserAgent);
            
            return new
            {
                DetectedLanguage = detectedLanguage,
                AcceptLanguage = request.AcceptLanguage,
                Direction = detectedLanguage.StartsWith("ar-") ? "rtl" : "ltr",
                Confidence = GetDetectionConfidence(request.AcceptLanguage, detectedLanguage)
            };
        }

        private double GetDetectionConfidence(string acceptLanguage, string detectedLanguage)
        {
            if (string.IsNullOrEmpty(acceptLanguage))
                return 0.5;

            if (acceptLanguage.Contains(detectedLanguage))
                return 0.9;
            
            if (acceptLanguage.Contains(detectedLanguage.Split('-')[0]))
                return 0.7;

            return 0.3;
        }
    }
}
