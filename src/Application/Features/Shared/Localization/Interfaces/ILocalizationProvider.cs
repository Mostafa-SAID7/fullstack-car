namespace Application.Features.Shared.Localization.Interfaces
{
    public interface ILocalizationProvider
    {
        Task<Dictionary<string, string>> GetResourcesAsync(string language);
        Task<Dictionary<string, string>> GetCategoryResourcesAsync(string language, string category);
        Task<string> GetTranslationAsync(string language, string key);
        Task<bool> ValidateTranslationAsync(string language, string key, string value);
    }
}