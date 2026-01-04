using MediatR;

namespace Application.Features.Shared.Localization.Commands
{
    public class BulkImportTranslationsCommand : IRequest<BulkImportResultDto>
    {
        public string Language { get; set; } = string.Empty;
        public List<TranslationImportDto> Translations { get; set; } = new List<TranslationImportDto>();
        public bool OverwriteExisting { get; set; } = false;
    }

    public class TranslationImportDto
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Category { get; set; } = "common";
        public string? Description { get; set; }
    }

    public class BulkImportResultDto
    {
        public int TotalProcessed { get; set; }
        public int SuccessfulImports { get; set; }
        public int FailedImports { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        public List<TranslationDto> ImportedTranslations { get; set; } = new List<TranslationDto>();
    }
}
