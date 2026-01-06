namespace Application.Features.Shared.Localization.Interfaces
{
    public interface ILanguageDetector
    {
        Task<string> DetectLanguageAsync(string acceptLanguage, string userAgent);
        Task<bool> IsLanguageSupportedAsync(string language);
        Task<string[]> GetSupportedLanguagesAsync();
        Task SetUserLanguageAsync(string userId, string language);
    }
}
