namespace Application.Common.Interfaces.Localization
{
    public interface ILocalizationService
    {
        Task<Dictionary<string, string>> GetResourcesAsync(string language);
        Task<Dictionary<string, string>> GetCategoryResourcesAsync(string language, string category);
        Task<string> GetTranslationAsync(string language, string key);
        Task SetUserLanguageAsync(string userId, string language);
        Task<string> DetectLanguageAsync(string acceptLanguage, string userAgent);
        Task<object> GetCultureInfoAsync(string language);
        Task<bool> ValidateTranslationAsync(string language, string key, string value);
        Task<bool> IsLanguageSupportedAsync(string language);
        Task<string[]> GetSupportedLanguagesAsync();
    }
}