using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Interfaces;

namespace WebAPI.Controllers.Shared.Localization
{
    [Route("api/shared/localization")]
    public class LocalizationController : BaseController
    {
        private readonly ILocalizationService _localizationService;

        public LocalizationController(ILocalizationService localizationService)
        {
            _localizationService = localizationService;
        }
        [HttpGet("languages")]
        public async Task<IActionResult> GetSupportedLanguages()
        {
            // Implementation for getting supported languages with regional variants
            var languages = new[]
            {
                new { 
                    Code = "en-US", 
                    Name = "English (United States)", 
                    NativeName = "English (US)",
                    IsDefault = true, 
                    Flag = "🇺🇸",
                    Direction = "ltr",
                    Region = "United States"
                },
                new { 
                    Code = "ar-EG", 
                    Name = "Arabic (Egypt)", 
                    NativeName = "العربية (مصر)",
                    IsDefault = false, 
                    Flag = "🇪🇬",
                    Direction = "rtl",
                    Region = "Egypt"
                },
                new { 
                    Code = "en-AS", 
                    Name = "English (American Samoa)", 
                    NativeName = "English (American Samoa)",
                    IsDefault = false, 
                    Flag = "🇦🇸",
                    Direction = "ltr",
                    Region = "American Samoa"
                },
                new { 
                    Code = "ar-AE", 
                    Name = "Arabic (United Arab Emirates)", 
                    NativeName = "العربية (الإمارات)",
                    IsDefault = false, 
                    Flag = "🇦🇪",
                    Direction = "rtl",
                    Region = "United Arab Emirates"
                }
            };
            
            return Ok(new { Languages = languages, TotalCount = languages.Length });
        }

        [HttpGet("resources/{language}")]
        public async Task<IActionResult> GetLanguageResources(string language)
        {
            // Implementation for getting comprehensive language resources
            var resources = GetResourcesForLanguage(language);
            
            return Ok(new { 
                Language = language,
                Resources = resources,
                Direction = IsRightToLeft(language) ? "rtl" : "ltr",
                LoadedAt = DateTime.UtcNow
            });
        }

        [HttpGet("resources/{language}/{category}")]
        public async Task<IActionResult> GetCategoryResources(string language, string category)
        {
            // Implementation for getting specific category translations
            var allResources = GetResourcesForLanguage(language);
            var categoryResources = allResources
                .Where(kvp => kvp.Key.StartsWith($"{category}."))
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            
            return Ok(new { 
                Language = language,
                Category = category,
                Resources = categoryResources,
                Count = categoryResources.Count
            });
        }

        [HttpGet("resources/{language}/{key}")]
        public async Task<IActionResult> GetTranslation(string language, string key)
        {
            // Implementation for getting specific translation
            var resources = GetResourcesForLanguage(language);
            var translation = resources.ContainsKey(key) ? resources[key] : key;
            
            return Ok(new { 
                Key = key, 
                Translation = translation, 
                Language = language,
                Found = resources.ContainsKey(key)
            });
        }

        [Authorize]
        [HttpPost("set-language")]
        public async Task<IActionResult> SetUserLanguage([FromBody] SetLanguageRequest request)
        {
            // Implementation for setting user's preferred language
            var supportedLanguages = new[] { "en-US", "ar-EG", "en-AS", "ar-AE" };
            
            if (!supportedLanguages.Contains(request.Language))
            {
                return BadRequest(new { Message = "Unsupported language", SupportedLanguages = supportedLanguages });
            }
            
            // Save to user preferences (implement actual database save)
            return Ok(new { 
                Message = "Language preference updated successfully", 
                Language = request.Language,
                Direction = IsRightToLeft(request.Language) ? "rtl" : "ltr"
            });
        }

        [HttpGet("detect")]
        public async Task<IActionResult> DetectLanguage()
        {
            // Implementation for detecting user's language from browser headers
            var acceptLanguage = Request.Headers["Accept-Language"].ToString();
            var detectedLanguage = DetectLanguageFromHeaders(acceptLanguage);
            
            return Ok(new { 
                DetectedLanguage = detectedLanguage,
                AcceptLanguage = acceptLanguage,
                Direction = IsRightToLeft(detectedLanguage) ? "rtl" : "ltr",
                Confidence = GetDetectionConfidence(acceptLanguage, detectedLanguage)
            });
        }

        [HttpGet("formats/{language}")]
        public async Task<IActionResult> GetLanguageFormats(string language)
        {
            // Implementation for getting language-specific formats
            var formats = GetLanguageFormats(language);
            
            return Ok(formats);
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateTranslations([FromBody] ValidateTranslationsRequest request)
        {
            // Implementation for validating translation completeness
            var baseResources = GetResourcesForLanguage("en-US");
            var targetResources = GetResourcesForLanguage(request.Language);
            
            var missingKeys = baseResources.Keys.Except(targetResources.Keys).ToList();
            var extraKeys = targetResources.Keys.Except(baseResources.Keys).ToList();
            
            return Ok(new {
                Language = request.Language,
                TotalKeys = baseResources.Count,
                TranslatedKeys = targetResources.Count,
                MissingKeys = missingKeys,
                ExtraKeys = extraKeys,
                CompletionPercentage = Math.Round((double)targetResources.Count / baseResources.Count * 100, 2)
            });
        }

        private Dictionary<string, string> GetResourcesForLanguage(string language)
        {
            return language switch
            {
                "en-US" => GetEnglishUSResources(),
                "ar-EG" => GetArabicEgyptResources(),
                "en-AS" => GetEnglishAmericanSamoaResources(),
                "ar-AE" => GetArabicUAEResources(),
                _ => GetEnglishUSResources() // Default fallback
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
                ["posts.comment"] = "Comment",
                ["posts.share"] = "Share",
                
                // Groups
                ["groups.create"] = "Create Group",
                ["groups.join"] = "Join Group",
                ["groups.leave"] = "Leave Group",
                ["groups.members"] = "Members",
                ["groups.description"] = "Description",
                
                // AI Assistant
                ["ai.chat"] = "Chat with AI",
                ["ai.recommendations"] = "Car Recommendations",
                ["ai.maintenance"] = "Maintenance Advice",
                ["ai.analysis"] = "Market Analysis",
                
                // Car specific
                ["car.make"] = "Make",
                ["car.model"] = "Model",
                ["car.year"] = "Year",
                ["car.mileage"] = "Mileage",
                ["car.condition"] = "Condition",
                
                // Admin
                ["admin.dashboard"] = "Dashboard",
                ["admin.users"] = "Users",
                ["admin.content"] = "Content",
                ["admin.reports"] = "Reports",
                ["admin.analytics"] = "Analytics"
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
                ["common.search"] = "بحث",
                ["common.loading"] = "جاري التحميل...",
                ["common.error"] = "خطأ",
                ["common.success"] = "تم بنجاح",
                
                // Navigation
                ["nav.home"] = "الرئيسية",
                ["nav.posts"] = "المنشورات",
                ["nav.groups"] = "الجروبات",
                ["nav.reviews"] = "التقييمات",
                ["nav.friends"] = "الأصحاب",
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
                ["posts.comment"] = "تعليق",
                ["posts.share"] = "مشاركة",
                
                // Groups
                ["groups.create"] = "إنشاء جروب",
                ["groups.join"] = "انضمام للجروب",
                ["groups.leave"] = "مغادرة الجروب",
                ["groups.members"] = "الأعضاء",
                ["groups.description"] = "الوصف",
                
                // AI Assistant
                ["ai.chat"] = "محادثة مع الذكي",
                ["ai.recommendations"] = "ترشيحات العربيات",
                ["ai.maintenance"] = "نصائح الصيانة",
                ["ai.analysis"] = "تحليل السوق",
                
                // Car specific - Egyptian terms
                ["car.make"] = "الماركة",
                ["car.model"] = "الموديل",
                ["car.year"] = "السنة",
                ["car.mileage"] = "الكيلومترات",
                ["car.condition"] = "الحالة",
                
                // Admin
                ["admin.dashboard"] = "لوحة التحكم",
                ["admin.users"] = "المستخدمين",
                ["admin.content"] = "المحتوى",
                ["admin.reports"] = "التقارير",
                ["admin.analytics"] = "الإحصائيات"
            };
        }

        private Dictionary<string, string> GetEnglishAmericanSamoaResources()
        {
            // American Samoa English with some local variations
            var resources = GetEnglishUSResources();
            
            // Add some local variations
            resources["common.welcome"] = "Welcome to our community";
            resources["nav.home"] = "Home Page";
            resources["car.condition"] = "Vehicle Condition";
            
            return resources;
        }

        private Dictionary<string, string> GetArabicUAEResources()
        {
            return new Dictionary<string, string>
            {
                // Common - UAE dialect
                ["common.welcome"] = "مرحباً وأهلاً",
                ["common.login"] = "تسجيل الدخول",
                ["common.logout"] = "تسجيل الخروج",
                ["common.register"] = "التسجيل",
                ["common.save"] = "حفظ",
                ["common.cancel"] = "إلغاء",
                ["common.delete"] = "حذف",
                ["common.edit"] = "تحرير",
                ["common.view"] = "عرض",
                ["common.search"] = "بحث",
                ["common.loading"] = "جاري التحميل...",
                ["common.error"] = "خطأ",
                ["common.success"] = "تم بنجاح",
                
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
                ["posts.comment"] = "تعليق",
                ["posts.share"] = "مشاركة",
                
                // Groups
                ["groups.create"] = "إنشاء مجموعة",
                ["groups.join"] = "انضمام للمجموعة",
                ["groups.leave"] = "مغادرة المجموعة",
                ["groups.members"] = "الأعضاء",
                ["groups.description"] = "الوصف",
                
                // AI Assistant
                ["ai.chat"] = "محادثة مع المساعد الذكي",
                ["ai.recommendations"] = "توصيات السيارات",
                ["ai.maintenance"] = "نصائح الصيانة",
                ["ai.analysis"] = "تحليل السوق",
                
                // Car specific - UAE terms
                ["car.make"] = "الصانع",
                ["car.model"] = "الطراز",
                ["car.year"] = "سنة الصنع",
                ["car.mileage"] = "المسافة المقطوعة",
                ["car.condition"] = "حالة السيارة",
                
                // Admin
                ["admin.dashboard"] = "لوحة المراقبة",
                ["admin.users"] = "المستخدمون",
                ["admin.content"] = "المحتوى",
                ["admin.reports"] = "التقارير",
                ["admin.analytics"] = "التحليلات"
            };
        }

        private bool IsRightToLeft(string language)
        {
            return language.StartsWith("ar-");
        }

        private string DetectLanguageFromHeaders(string acceptLanguage)
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
                if (lang.StartsWith("ar-AE") || lang.StartsWith("ar_AE"))
                    return "ar-AE";
                if (lang.StartsWith("en-AS") || lang.StartsWith("en_AS"))
                    return "en-AS";
                if (lang.StartsWith("en-US") || lang.StartsWith("en_US") || lang == "en")
                    return "en-US";
            }

            return "en-US"; // Default fallback
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

        private object GetLanguageFormats(string language)
        {
            return language switch
            {
                "ar-EG" or "ar-AE" => new
                {
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    NumberFormat = "###,###.##",
                    CurrencySymbol = language == "ar-EG" ? "ج.م" : "د.إ",
                    CurrencyPosition = "after",
                    DecimalSeparator = ".",
                    ThousandsSeparator = ",",
                    Calendar = "Hijri",
                    WeekStart = "Saturday"
                },
                _ => new
                {
                    DateFormat = "MM/dd/yyyy",
                    TimeFormat = "h:mm tt",
                    NumberFormat = "###,###.##",
                    CurrencySymbol = "$",
                    CurrencyPosition = "before",
                    DecimalSeparator = ".",
                    ThousandsSeparator = ",",
                    Calendar = "Gregorian",
                    WeekStart = "Sunday"
                }
            };
        }
    }

    public class SetLanguageRequest
    {
        public string Language { get; set; } = "en-US";
    }

    public class ValidateTranslationsRequest
    {
        public string Language { get; set; } = string.Empty;
    }
}