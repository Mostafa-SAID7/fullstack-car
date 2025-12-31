using Application.Features.Shared.Localization.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Application.Features.Shared.Localization.Services
{
    public class LocalizationProvider : ILocalizationProvider
    {
        private readonly ILogger<LocalizationProvider> _logger;
        private readonly Dictionary<string, Dictionary<string, string>> _resourceCache;
        private readonly string _resourcesPath;
        private readonly string[] _supportedLanguages = { "en-US", "ar-EG", "ar-SA", "ar-AE" };

        public LocalizationProvider(ILogger<LocalizationProvider> logger)
        {
            _logger = logger;
            _resourceCache = new Dictionary<string, Dictionary<string, string>>();
            _resourcesPath = Path.Combine(Directory.GetCurrentDirectory(), "Resources");
            LoadAllResources();
        }

        public Task<Dictionary<string, string>> GetCategoryResourcesAsync(string language, string category)
        {
            var cacheKey = $"{category}_{language}";
            if (_resourceCache.TryGetValue(cacheKey, out var cached))
            {
                return Task.FromResult(cached);
            }

            // Fallback to English
            var fallbackKey = $"{category}_en-US";
            return Task.FromResult(_resourceCache.TryGetValue(fallbackKey, out var fallback)
                ? fallback
                : new Dictionary<string, string>());
        }

        public Task<Dictionary<string, string>> GetResourcesAsync(string language)
        {
            var cacheKey = $"all_{language}";
            if (_resourceCache.TryGetValue(cacheKey, out var cached))
            {
                return Task.FromResult(cached);
            }

            var fallbackKey = "all_en-US";
            return Task.FromResult(_resourceCache.TryGetValue(fallbackKey, out var fallback)
                ? fallback
                : new Dictionary<string, string>());
        }

        public async Task<string> GetTranslationAsync(string language, string key)
        {
            var resources = await GetResourcesAsync(language);
            return resources.TryGetValue(key, out var translation) ? translation : key;
        }

        public Task<bool> ValidateTranslationAsync(string language, string key, string value)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(value))
                return Task.FromResult(false);

            if (language.StartsWith("ar-") && !ContainsArabicCharacters(value))
                return Task.FromResult(false);

            return Task.FromResult(true);
        }

        private void LoadAllResources()
        {
            foreach (var language in _supportedLanguages)
            {
                try
                {
                    var allResources = new Dictionary<string, string>();
                    LoadHierarchicalResources(language, allResources);

                    var cacheKey = $"all_{language}";
                    _resourceCache[cacheKey] = allResources;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading resources for language {Language}", language);
                }
            }
        }

        private void LoadHierarchicalResources(string language, Dictionary<string, string> allResources)
        {
            var resourceDirectories = new[]
            {
                "Dashboard/Admin/Dashboard", "Dashboard/Admin/Management", "Dashboard/Admin/Moderation",
                "Main/Community/Posts", "Main/Community/Groups", "Main/Community/Social", "Main/Community/Reviews",
                "Identity/Auth", "Identity/OAuth", "Identity/Password", "Identity/Profile", "Identity/Security",
                "AIAgent",
                "Shared/Common", "Shared/Files", "Shared/Localization"
            };

            foreach (var directory in resourceDirectories)
            {
                var filePath = Path.Combine(_resourcesPath, directory, $"{language}.json");
                if (File.Exists(filePath))
                {
                    try
                    {
                        var jsonContent = File.ReadAllText(filePath);
                        var jsonDocument = JsonDocument.Parse(jsonContent);
                        var resources = FlattenJsonObject(jsonDocument.RootElement, directory.Replace("/", ".").ToLower());

                        foreach (var kvp in resources)
                        {
                            allResources[kvp.Key] = kvp.Value;
                        }

                        var categoryKey = $"{directory.Replace("/", ".")}_{language}";
                        _resourceCache[categoryKey] = resources;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to load resources from {directory} for {language}: {ex.Message}");
                    }
                }
            }
        }

        private Dictionary<string, string> FlattenJsonObject(JsonElement element, string prefix = "")
        {
            var result = new Dictionary<string, string>();

            foreach (var property in element.EnumerateObject())
            {
                var key = string.IsNullOrEmpty(prefix)
                    ? property.Name
                    : $"{prefix}.{property.Name}";

                if (property.Value.ValueKind == JsonValueKind.Object)
                {
                    var nested = FlattenJsonObject(property.Value, key);
                    foreach (var kvp in nested)
                    {
                        result[kvp.Key] = kvp.Value;
                    }
                }
                else if (property.Value.ValueKind == JsonValueKind.String)
                {
                    result[key] = property.Value.GetString() ?? "";
                }
            }

            return result;
        }

        private bool ContainsArabicCharacters(string text)
        {
            return text.Any(c => c >= 0x0600 && c <= 0x06FF);
        }
    }
}
