using MediatR;
using Application.Common.Interfaces;

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

    public class CreateTranslationCommandHandler : IRequestHandler<CreateTranslationCommand, TranslationDto>
    {
        private readonly ITranslationRepository _repository;

        public CreateTranslationCommandHandler(ITranslationRepository repository)
        {
            _repository = repository;
        }

        public async Task<TranslationDto> Handle(CreateTranslationCommand request, CancellationToken cancellationToken)
        {
            var result = await _repository.CreateTranslationAsync(
                request.Key, 
                request.Value, 
                request.Language, 
                request.Category, 
                request.Description, 
                request.IsActive, 
                cancellationToken);

            // Re-map the generic object to TranslationDto
            var json = global::System.Text.Json.JsonSerializer.Serialize(result);
            var dto = global::System.Text.Json.JsonSerializer.Deserialize<TranslationDto>(json, new global::System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
            
            return dto;
        }
    }
}
