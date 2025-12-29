using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.Json;

namespace Infrastructure.Services
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
            _resourcesPath = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Localization");
            LoadAllResources();
        }

        public async Task<Dictionary<string, string>> GetResourcesAsync(string language)
        {
            if (_resourceCache.ContainsKey(language))
            {
                return _resourceCache[language];
            }

            // Fallback to English if language not found
            return _resourceCache.ContainsKey("en-US") ? _resourceCache["en-US"] : new Dictionary<string, string>();
        }

        public async Task<Dictionary<string, string>> GetCategoryResourcesAsync(string language, string category)
        {
            var allResources = await GetResourcesAsync(language);
            return allResources
                .Where(kvp => kvp.Key.StartsWith($"{category}."))
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
        }

        public async Task<string> GetTranslationAsync(string language, string key)
        {
            var resources = await GetResourcesAsync(language);
            return resources.ContainsKey(key) ? resources[key] : key;
        }

        public async Task SetUserLanguageAsync(string userId, string language)
        {
            // Implementation would save to database
            _logger.LogInformation("Setting language {Language} for user {UserId}", language, userId);
            // TODO: Implement database save
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
                    NumberFormat = "###,###.##",
                    CurrencySymbol = "ج.م",
                    CurrencyCode = "EGP",
                    DecimalSeparator = ".",
                    ThousandsSeparator = ",",
                    Calendar = "Hijri",
                    WeekStart = "Saturday",
                    Dialect = "Egyptian"
                },
                "ar-SA" => new
                {
                    Language = "ar-SA",
                    DisplayName = "Arabic (Saudi Arabia)",
                    NativeName = "العربية (السعودية)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    NumberFormat = "###,###.##",
                    CurrencySymbol = "ر.س",
                    CurrencyCode = "SAR",
                    DecimalSeparator = ".",
                    ThousandsSeparator = ",",
                    Calendar = "Hijri",
                    WeekStart = "Saturday",
                    Dialect = "Gulf/Najdi"
                },
                "ar-AE" => new
                {
                    Language = "ar-AE",
                    DisplayName = "Arabic (UAE)",
                    NativeName = "العربية (الإمارات)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    NumberFormat = "###,###.##",
                    CurrencySymbol = "د.إ",
                    CurrencyCode = "AED",
                    DecimalSeparator = ".",
                    ThousandsSeparator = ",",
                    Calendar = "Hijri",
                    WeekStart = "Saturday",
                    Dialect = "Emirati/Gulf"
                },
                _ => new
                {
                    Language = "en-US",
                    DisplayName = "English (United States)",
                    NativeName = "English (US)",
                    Direction = "ltr",
                    DateFormat = "MM/dd/yyyy",
                    TimeFormat = "h:mm tt",
                    NumberFormat = "###,###.##",
                    CurrencySymbol = "$",
                    CurrencyCode = "USD",
                    DecimalSeparator = ".",
                    ThousandsSeparator = ",",
                    Calendar = "Gregorian",
                    WeekStart = "Sunday",
                    Dialect = "American English"
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
                    var filePath = Path.Combine(_resourcesPath, $"{language}.json");
                    if (File.Exists(filePath))
                    {
                        var jsonContent = File.ReadAllText(filePath);
                        var jsonDocument = JsonDocument.Parse(jsonContent);
                        _resourceCache[language] = FlattenJsonObject(jsonDocument.RootElement);
                        _logger.LogInformation("Loaded {Count} resources for language {Language}", _resourceCache[language].Count, language);
                    }
                    else
                    {
                        _logger.LogWarning("Resource file not found for language {Language} at path {Path}", language, filePath);
                        _resourceCache[language] = GetFallbackResources(language);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading resources for language {Language}", language);
                    _resourceCache[language] = GetFallbackResources(language);
                }
            }
        }

        private Dictionary<string, string> FlattenJsonObject(JsonElement element, string prefix = "")
        {
            var result = new Dictionary<string, string>();

            foreach (var property in element.EnumerateObject())
            {
                var key = string.IsNullOrEmpty(prefix) ? property.Name : $"{prefix}.{property.Name}";

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
            return language switch
            {
                "ar-EG" => GetArabicEgyptResources(),
                "ar-SA" => GetArabicSaudiResources(),
                "ar-AE" => GetArabicUAEResources(),
                _ => GetEnglishUSResources()
            };
        }

        private Dictionary<string, string> GetEnglishUSResources()
        {
            return new Dictionary<string, string>
            {
                // Common
                ["common.welcome"] = "Welcome",
                ["common.login"] = "Login",
                ["common.logout"] = "Logout",
                ["common.register"] = "Register",
                ["common.save"] = "Save",
                ["common.cancel"] = "Cancel",
                ["common.delete"] = "Delete",
                ["common.edit"] = "Edit",
                ["common.view"] = "View",
                ["common.search"] = "Search",
                ["common.loading"] = "Loading...",
                ["common.error"] = "Error",
                ["common.success"] = "Success",
                ["common.yes"] = "Yes",
                ["common.no"] = "No",
                ["common.ok"] = "OK",
                ["common.close"] = "Close",
                
                // Navigation
                ["nav.home"] = "Home",
                ["nav.posts"] = "Posts",
                ["nav.groups"] = "Groups",
                ["nav.reviews"] = "Reviews",
                ["nav.friends"] = "Friends",
                ["nav.profile"] = "Profile",
                ["nav.settings"] = "Settings",
                ["nav.admin"] = "Admin",
                ["nav.aiAgent"] = "AI Assistant",
                
                // Posts
                ["posts.create"] = "Create Post",
                ["posts.title"] = "Title",
                ["posts.content"] = "Content",
                ["posts.publish"] = "Publish",
                ["posts.draft"] = "Save as Draft",
                ["posts.like"] = "Like",
                ["posts.unlike"] = "Unlike",
                ["posts.comment"] = "Comment",
                ["posts.share"] = "Share",
                ["posts.report"] = "Report",
                
                // Groups
                ["groups.create"] = "Create Group",
                ["groups.join"] = "Join Group",
                ["groups.leave"] = "Leave Group",
                ["groups.members"] = "Members",
                ["groups.description"] = "Description",
                ["groups.privacy"] = "Privacy",
                ["groups.public"] = "Public",
                ["groups.private"] = "Private",
                
                // AI Assistant
                ["ai.chat"] = "Chat with AI",
                ["ai.recommendations"] = "Car Recommendations",
                ["ai.maintenance"] = "Maintenance Advice",
                ["ai.analysis"] = "Market Analysis",
                ["ai.askQuestion"] = "Ask a question about cars...",
                
                // Car specific
                ["car.make"] = "Make",
                ["car.model"] = "Model",
                ["car.year"] = "Year",
                ["car.mileage"] = "Mileage",
                ["car.condition"] = "Condition",
                ["car.price"] = "Price",
                ["car.fuel"] = "Fuel Type",
                ["car.transmission"] = "Transmission",
                
                // Admin
                ["admin.dashboard"] = "Dashboard",
                ["admin.users"] = "Users",
                ["admin.content"] = "Content",
                ["admin.reports"] = "Reports",
                ["admin.analytics"] = "Analytics",
                ["admin.settings"] = "Settings"
            };
        }

        private Dictionary<string, string> GetArabicEgyptResources()
        {
            return new Dictionary<string, string>
            {
                // Common - Egyptian dialect
                ["common.welcome"] = "أهلاً وسهلاً",
                ["common.login"] = "دخول",
                ["common.logout"] = "خروج",
                ["common.register"] = "تسجيل",
                ["common.save"] = "حفظ",
                ["common.cancel"] = "إلغاء",
                ["common.delete"] = "مسح",
                ["common.edit"] = "تعديل",
                ["common.view"] = "عرض",
                ["common.search"] = "دور",
                ["common.loading"] = "بيحمل...",
                ["common.error"] = "غلط",
                ["common.success"] = "تمام",
                ["common.yes"] = "أيوة",
                ["common.no"] = "لأ",
                ["common.ok"] = "ماشي",
                ["common.close"] = "قفل",
                
                // Navigation
                ["nav.home"] = "البيت",
                ["nav.posts"] = "البوستات",
                ["nav.groups"] = "الجروبات",
                ["nav.reviews"] = "التقييمات",
                ["nav.friends"] = "الأصحاب",
                ["nav.profile"] = "البروفايل",
                ["nav.settings"] = "الإعدادات",
                ["nav.admin"] = "الإدارة",
                ["nav.aiAgent"] = "الذكي",
                
                // Posts
                ["posts.create"] = "اعمل بوست",
                ["posts.title"] = "العنوان",
                ["posts.content"] = "الكلام",
                ["posts.publish"] = "انشر",
                ["posts.draft"] = "احفظ مسودة",
                ["posts.like"] = "عجبني",
                ["posts.unlike"] = "مش عاجبني",
                ["posts.comment"] = "علق",
                ["posts.share"] = "شارك",
                ["posts.report"] = "بلغ",
                
                // Groups
                ["groups.create"] = "اعمل جروب",
                ["groups.join"] = "ادخل الجروب",
                ["groups.leave"] = "اطلع من الجروب",
                ["groups.members"] = "الأعضاء",
                ["groups.description"] = "الوصف",
                ["groups.privacy"] = "الخصوصية",
                ["groups.public"] = "عام",
                ["groups.private"] = "خاص",
                
                // AI Assistant
                ["ai.chat"] = "كلم الذكي",
                ["ai.recommendations"] = "ترشيحات العربيات",
                ["ai.maintenance"] = "نصايح الصيانة",
                ["ai.analysis"] = "تحليل السوق",
                ["ai.askQuestion"] = "اسأل عن العربيات...",
                
                // Car specific - Egyptian terms
                ["car.make"] = "الماركة",
                ["car.model"] = "الموديل",
                ["car.year"] = "السنة",
                ["car.mileage"] = "الكيلو",
                ["car.condition"] = "الحالة",
                ["car.price"] = "السعر",
                ["car.fuel"] = "نوع البنزين",
                ["car.transmission"] = "الفتيس",
                
                // Admin
                ["admin.dashboard"] = "لوحة التحكم",
                ["admin.users"] = "اليوزرز",
                ["admin.content"] = "المحتوى",
                ["admin.reports"] = "التقارير",
                ["admin.analytics"] = "الإحصائيات",
                ["admin.settings"] = "الإعدادات"
            };
        }

        private Dictionary<string, string> GetArabicSaudiResources()
        {
            return new Dictionary<string, string>
            {
                // Common - Saudi dialect
                ["common.welcome"] = "أهلاً وسهلاً",
                ["common.login"] = "دخول",
                ["common.logout"] = "خروج",
                ["common.register"] = "تسجيل",
                ["common.save"] = "حفظ",
                ["common.cancel"] = "إلغاء",
                ["common.delete"] = "حذف",
                ["common.edit"] = "تعديل",
                ["common.view"] = "عرض",
                ["common.search"] = "بحث",
                ["common.loading"] = "يحمل...",
                ["common.error"] = "خطأ",
                ["common.success"] = "تم",
                ["common.yes"] = "إي",
                ["common.no"] = "لا",
                ["common.ok"] = "زين",
                ["common.close"] = "سكر",
                
                // Navigation
                ["nav.home"] = "الرئيسية",
                ["nav.posts"] = "المنشورات",
                ["nav.groups"] = "المجموعات",
                ["nav.reviews"] = "التقييمات",
                ["nav.friends"] = "الرفاق",
                ["nav.profile"] = "الملف الشخصي",
                ["nav.settings"] = "الإعدادات",
                ["nav.admin"] = "الإدارة",
                ["nav.aiAgent"] = "المساعد الذكي",
                
                // Posts
                ["posts.create"] = "إنشاء منشور",
                ["posts.title"] = "العنوان",
                ["posts.content"] = "المحتوى",
                ["posts.publish"] = "نشر",
                ["posts.draft"] = "حفظ كمسودة",
                ["posts.like"] = "إعجاب",
                ["posts.unlike"] = "إلغاء الإعجاب",
                ["posts.comment"] = "تعليق",
                ["posts.share"] = "مشاركة",
                ["posts.report"] = "بلاغ",
                
                // Groups
                ["groups.create"] = "إنشاء مجموعة",
                ["groups.join"] = "انضمام للمجموعة",
                ["groups.leave"] = "مغادرة المجموعة",
                ["groups.members"] = "الأعضاء",
                ["groups.description"] = "الوصف",
                ["groups.privacy"] = "الخصوصية",
                ["groups.public"] = "عامة",
                ["groups.private"] = "خاصة",
                
                // AI Assistant
                ["ai.chat"] = "محادثة مع الذكي",
                ["ai.recommendations"] = "توصيات السيارات",
                ["ai.maintenance"] = "نصائح الصيانة",
                ["ai.analysis"] = "تحليل السوق",
                ["ai.askQuestion"] = "اسأل عن السيارات...",
                
                // Car specific - Saudi terms
                ["car.make"] = "الصانع",
                ["car.model"] = "الطراز",
                ["car.year"] = "سنة الصنع",
                ["car.mileage"] = "المسافة المقطوعة",
                ["car.condition"] = "حالة السيارة",
                ["car.price"] = "السعر",
                ["car.fuel"] = "نوع الوقود",
                ["car.transmission"] = "ناقل الحركة",
                
                // Admin
                ["admin.dashboard"] = "لوحة المراقبة",
                ["admin.users"] = "المستخدمون",
                ["admin.content"] = "المحتوى",
                ["admin.reports"] = "التقارير",
                ["admin.analytics"] = "التحليلات",
                ["admin.settings"] = "الإعدادات"
            };
        }

        private Dictionary<string, string> GetArabicUAEResources()
        {
            return new Dictionary<string, string>
            {
                // Common - UAE dialect
                ["common.welcome"] = "مرحباً وأهلاً",
                ["common.login"] = "دخول",
                ["common.logout"] = "خروج",
                ["common.register"] = "تسجيل",
                ["common.save"] = "حفظ",
                ["common.cancel"] = "إلغاء",
                ["common.delete"] = "حذف",
                ["common.edit"] = "تعديل",
                ["common.view"] = "عرض",
                ["common.search"] = "بحث",
                ["common.loading"] = "يحمل...",
                ["common.error"] = "خطأ",
                ["common.success"] = "تم بنجاح",
                ["common.yes"] = "إي",
                ["common.no"] = "لا",
                ["common.ok"] = "ماشي",
                ["common.close"] = "سكر",
                
                // Navigation
                ["nav.home"] = "الصفحة الرئيسية",
                ["nav.posts"] = "المنشورات",
                ["nav.groups"] = "المجموعات",
                ["nav.reviews"] = "المراجعات",
                ["nav.friends"] = "الأصدقاء",
                ["nav.profile"] = "الملف الشخصي",
                ["nav.settings"] = "الإعدادات",
                ["nav.admin"] = "الإدارة",
                ["nav.aiAgent"] = "المساعد الذكي",
                
                // Posts
                ["posts.create"] = "إنشاء منشور",
                ["posts.title"] = "العنوان",
                ["posts.content"] = "المحتوى",
                ["posts.publish"] = "نشر",
                ["posts.draft"] = "حفظ كمسودة",
                ["posts.like"] = "إعجاب",
                ["posts.unlike"] = "إلغاء الإعجاب",
                ["posts.comment"] = "تعليق",
                ["posts.share"] = "مشاركة",
                ["posts.report"] = "بلاغ",
                
                // Groups
                ["groups.create"] = "إنشاء مجموعة",
                ["groups.join"] = "انضمام للمجموعة",
                ["groups.leave"] = "مغادرة المجموعة",
                ["groups.members"] = "الأعضاء",
                ["groups.description"] = "الوصف",
                ["groups.privacy"] = "الخصوصية",
                ["groups.public"] = "عامة",
                ["groups.private"] = "خاصة",
                
                // AI Assistant
                ["ai.chat"] = "محادثة مع المساعد الذكي",
                ["ai.recommendations"] = "توصيات السيارات",
                ["ai.maintenance"] = "نصائح الصيانة",
                ["ai.analysis"] = "تحليل السوق",
                ["ai.askQuestion"] = "اسأل عن السيارات...",
                
                // Car specific - UAE terms
                ["car.make"] = "الصانع",
                ["car.model"] = "الطراز",
                ["car.year"] = "سنة الصنع",
                ["car.mileage"] = "المسافة المقطوعة",
                ["car.condition"] = "حالة السيارة",
                ["car.price"] = "السعر",
                ["car.fuel"] = "نوع الوقود",
                ["car.transmission"] = "ناقل الحركة",
                
                // Admin
                ["admin.dashboard"] = "لوحة المراقبة",
                ["admin.users"] = "المستخدمون",
                ["admin.content"] = "المحتوى",
                ["admin.reports"] = "التقارير",
                ["admin.analytics"] = "التحليلات",
                ["admin.settings"] = "الإعدادات"
            };
        }

        private bool ContainsArabicCharacters(string text)
        {
            return text.Any(c => c >= 0x0600 && c <= 0x06FF);
        }
    }
}