using MediatR;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetTranslationStatsQuery : IRequest<TranslationStatsDto>
    {
    }

    public class TranslationStatsDto
    {
        public int TotalTranslations { get; set; }
        public int TotalLanguages { get; set; }
        public int TotalCategories { get; set; }
        public int ActiveTranslations { get; set; }
        public int InactiveTranslations { get; set; }
        public Dictionary<string, int> TranslationsByLanguage { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> TranslationsByCategory { get; set; } = new Dictionary<string, int>();
        public DateTime LastUpdated { get; set; }
    }
}
