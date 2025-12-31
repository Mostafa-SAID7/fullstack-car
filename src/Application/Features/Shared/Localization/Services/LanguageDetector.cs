using Application.Features.Shared.Localization.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Localization.Services
{
    public class LanguageDetector : ILanguageDetector
    {
        private readonly ILogger<LanguageDetector> _logger;
        private readonly string[] _supportedLanguages = { "en-US", "ar-EG", "ar-SA", "ar-AE" };

        public LanguageDetector(ILogger<LanguageDetector> logger)
        {
            _logger = logger;
        }

        public Task<string> DetectLanguageAsync(string acceptLanguage, string userAgent)
        {
            if (string.IsNullOrEmpty(acceptLanguage))
                return Task.FromResult("en-US");

            var languages = acceptLanguage.Split(',')
                .Select(lang => lang.Split(';')[0].Trim())
                .ToList();

            foreach (var lang in languages)
            {
                if (lang.StartsWith("ar-EG") || lang.StartsWith("ar_EG")) return Task.FromResult("ar-EG");
                if (lang.StartsWith("ar-SA") || lang.StartsWith("ar_SA")) return Task.FromResult("ar-SA");
                if (lang.StartsWith("ar-AE") || lang.StartsWith("ar_AE")) return Task.FromResult("ar-AE");
                
                // General Arabic fallback to Egyptian (most common dialect in media) or Saudi depending on preference
                // For now, let's strictly follow supported dialects or default to English
                if (lang.StartsWith("ar")) return Task.FromResult("ar-EG"); 

                if (lang.StartsWith("en-US") || lang.StartsWith("en_US") || lang == "en") return Task.FromResult("en-US");
            }

            return Task.FromResult("en-US");
        }

        public Task<string[]> GetSupportedLanguagesAsync()
        {
            return Task.FromResult(_supportedLanguages);
        }

        public Task<bool> IsLanguageSupportedAsync(string language)
        {
            return Task.FromResult(_supportedLanguages.Contains(language));
        }

        public Task SetUserLanguageAsync(string userId, string language)
        {
             _logger.LogInformation(
                "Setting language {Language} for user {UserId}", 
                language, 
                userId);
            // TODO: Persist to database if UserSettings exist
            return Task.CompletedTask;
        }
    }
}
