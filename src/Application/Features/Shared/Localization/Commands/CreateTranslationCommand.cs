using MediatR;

namespace Application.Features.Shared.Localization.Commands
{
    public class CreateTranslationCommand : IRequest<TranslationDto>
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Category { get; set; } = "common";
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class TranslationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Category { get; set; } = "common";
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }
    }
}
