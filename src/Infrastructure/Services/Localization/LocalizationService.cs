using Application.Common.Interfaces.Localization;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.Json;

namespace Infrastructure.Services.Localization
{
    public class LocalizationService : ILocalizationService
    {
        private readonly ILogger<LocalizationService> _logger;
        private readonly Dictionary<string, Dictionary<string, string>> _resourceCache;
        private readonly string[] _supportedLanguages = { "en-US", "ar-EG", "ar-SA", "ar-AE" };
        private readonly string _resourcesPath;

        public LocalizationService(ILogger<LocalizationService> logger)
        {
            _logger = logger;
            _resourceCache = new Dictionary<string, Dictionary<string, string>>();
            _resourcesPath = Path.Combine(
                Directory.GetCurrentDirectory(), 
                "Resources");
            LoadAllResources();
        }

        public async Task<Dictionary<string, string>> GetResourcesAsync(string language)
        {
            var cacheKey = $"all_{language}";
            if (_resourceCache.ContainsKey(cacheKey))
            {
                return _resourceCache[cacheKey];
            }

            // Fallback to English if language not found
            var fallbackKey = $"all_en-US";
            return _resourceCache.ContainsKey(fallbackKey) 
                ? _resourceCache[fallbackKey] 
                : new Dictionary<string, string>();
        }

        public async Task<Dictionary<string, string>> GetCategoryResourcesAsync(
            string language, 
            string category)
        {
            var cacheKey = $"{category}_{language}";
            if (_resourceCache.ContainsKey(cacheKey))
            {
                return _resourceCache[cacheKey];
            }

            // Try to load specific category resources
            var categoryResources = await LoadCategoryResourcesAsync(language, category);
            if (categoryResources.Any())
            {
                _resourceCache[cacheKey] = categoryResources;
                return categoryResources;
            }

            // Fallback to English
            var fallbackKey = $"{category}_en-US";
            return _resourceCache.ContainsKey(fallbackKey) 
                ? _resourceCache[fallbackKey] 
                : new Dictionary<string, string>();
        }

        public async Task<string> GetTranslationAsync(string language, string key)
        {
            var resources = await GetResourcesAsync(language);
            return resources.ContainsKey(key) ? resources[key] : key;
        }

        public async Task SetUserLanguageAsync(string userId, string language)
        {
            // Implementation would save to database
            _logger.LogInformation(
                "Setting language {Language} for user {UserId}", 
                language, 
                userId);
            // TODO: Implement database save
            await Task.CompletedTask;
        }

        public async Task<string> DetectLanguageAsync(string acceptLanguage, string userAgent)
        {
            if (string.IsNullOrEmpty(acceptLanguage))
                return "en-US";

            var languages = acceptLanguage.Split(',')
                .Select(lang => lang.Split(';')[0].Trim())
                .ToList();

            foreach (var lang in languages)
            {
                if (lang.StartsWith("ar-EG") || lang.StartsWith("ar_EG"))
                    return "ar-EG";
                if (lang.StartsWith("ar-SA") || lang.StartsWith("ar_SA"))
                    return "ar-SA";
                if (lang.StartsWith("ar-AE") || lang.StartsWith("ar_AE"))
                    return "ar-AE";
                if (lang.StartsWith("en-US") || lang.StartsWith("en_US") || lang == "en")
                    return "en-US";
            }

            return "en-US";
        }

        public async Task<object> GetCultureInfoAsync(string language)
        {
            return language switch
            {
                "ar-EG" => new
                {
                    Language = "ar-EG",
                    DisplayName = "Arabic (Egypt)",
                    NativeName = "العربية (مصر)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    CurrencySymbol = "ج.م",
                    CurrencyCode = "EGP"
                },
                "ar-SA" => new
                {
                    Language = "ar-SA",
                    DisplayName = "Arabic (Saudi Arabia)",
                    NativeName = "العربية (السعودية)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    CurrencySymbol = "ر.س",
                    CurrencyCode = "SAR"
                },
                "ar-AE" => new
                {
                    Language = "ar-AE",
                    DisplayName = "Arabic (UAE)",
                    NativeName = "العربية (الإمارات)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    CurrencySymbol = "د.إ",
                    CurrencyCode = "AED"
                },
                _ => new
                {
                    Language = "en-US",
                    DisplayName = "English (United States)",
                    NativeName = "English (US)",
                    Direction = "ltr",
                    DateFormat = "MM/dd/yyyy",
                    TimeFormat = "h:mm tt",
                    CurrencySymbol = "$",
                    CurrencyCode = "USD"
                }
            };
        }

        public async Task<bool> ValidateTranslationAsync(string language, string key, string value)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(value))
                return false;

            // Basic validation - can be enhanced with more sophisticated checks
            if (language.StartsWith("ar-") && !ContainsArabicCharacters(value))
                return false;

            return true;
        }

        public async Task<bool> IsLanguageSupportedAsync(string language)
        {
            return _supportedLanguages.Contains(language);
        }

        public async Task<string[]> GetSupportedLanguagesAsync()
        {
            return _supportedLanguages;
        }

        private void LoadAllResources()
        {
            foreach (var language in _supportedLanguages)
            {
                try
                {
                    // Load all resources for each language
                    var allResources = new Dictionary<string, string>();
                    
                    // Load hierarchical resources
                    LoadHierarchicalResources(language, allResources);
                    
                    // Cache all resources
                    var cacheKey = $"all_{language}";
                    _resourceCache[cacheKey] = allResources;
                    
                    _logger.LogInformation(
                        "Loaded {Count} resources for language {Language}", 
                        allResources.Count, 
                        language);
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex, 
                        "Error loading resources for language {Language}", 
                        language);
                    
                    // Set fallback resources
                    var cacheKey = $"all_{language}";
                    _resourceCache[cacheKey] = GetFallbackResources(language);
                }
            }
        }

        private void LoadHierarchicalResources(string language, Dictionary<string, string> allResources)
        {
            var resourceDirectories = new[]
            {
                "Admin/Dashboard",
                "Admin/Management", 
                "Admin/Moderation",
                "Community/Posts",
                "Community/Groups",
                "Community/Social",
                "Community/Reviews",
                "Identity",
                "AIAgent",
                "Shared/Common",
                "Shared/Files",
                "Shared/Localization"
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

                        // Also cache category-specific resources
                        var categoryKey = $"{directory.Replace("/", ".")}_{language}";
                        _resourceCache[categoryKey] = resources;
                        
                        _logger.LogDebug(
                            "Loaded {Count} resources from {Directory} for language {Language}",
                            resources.Count, directory, language);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, 
                            "Failed to load resources from {Directory} for language {Language}",
                            directory, language);
                    }
                }
                else
                {
                    _logger.LogDebug(
                        "Resource file not found: {FilePath}",
                        filePath);
                }
            }

            // Also load legacy flat resources if they exist
            LoadLegacyResources(language, allResources);
        }

        private void LoadLegacyResources(string language, Dictionary<string, string> allResources)
        {
            var legacyPath = Path.Combine(_resourcesPath, "Localization", $"{language}.json");
            if (File.Exists(legacyPath))
            {
                try
                {
                    var jsonContent = File.ReadAllText(legacyPath);
                    var jsonDocument = JsonDocument.Parse(jsonContent);
                    var resources = FlattenJsonObject(jsonDocument.RootElement);
                    
                    foreach (var kvp in resources)
                    {
                        // Only add if not already present from hierarchical resources
                        if (!allResources.ContainsKey(kvp.Key))
                        {
                            allResources[kvp.Key] = kvp.Value;
                        }
                    }
                    
                    _logger.LogDebug(
                        "Loaded {Count} legacy resources for language {Language}",
                        resources.Count, language);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, 
                        "Failed to load legacy resources for language {Language}",
                        language);
                }
            }
        }

        private async Task<Dictionary<string, string>> LoadCategoryResourcesAsync(string language, string category)
        {
            var categoryPath = category.Replace(".", "/");
            var filePath = Path.Combine(_resourcesPath, categoryPath, $"{language}.json");
            
            if (!File.Exists(filePath))
            {
                return new Dictionary<string, string>();
            }

            try
            {
                var jsonContent = await File.ReadAllTextAsync(filePath);
                var jsonDocument = JsonDocument.Parse(jsonContent);
                return FlattenJsonObject(jsonDocument.RootElement, category.ToLower());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Error loading category resources from {FilePath}",
                    filePath);
                return new Dictionary<string, string>();
            }
        }

        private Dictionary<string, string> FlattenJsonObject(
            JsonElement element, 
            string prefix = "")
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

        private Dictionary<string, string> GetFallbackResources(string language)
        {
            // Basic fallback resources for each language
            return new Dictionary<string, string>
            {
                ["shared.common.welcome"] = language.StartsWith("ar-") ? "مرحباً" : "Welcome",
                ["shared.common.login"] = language.StartsWith("ar-") ? "دخول" : "Login",
                ["shared.common.logout"] = language.StartsWith("ar-") ? "خروج" : "Logout",
                ["shared.common.save"] = language.StartsWith("ar-") ? "حفظ" : "Save",
                ["shared.common.cancel"] = language.StartsWith("ar-") ? "إلغاء" : "Cancel",
                ["community.posts.title"] = language.StartsWith("ar-") ? "المنشورات" : "Posts",
                ["community.groups.title"] = language.StartsWith("ar-") ? "المجموعات" : "Groups"
            };
        }

        private bool ContainsArabicCharacters(string text)
        {
            return text.Any(c => c >= 0x0600 && c <= 0x06FF);
        }
    }
}