using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Commands
{
    public class UpdateTranslationCommand : IRequest<TranslationDto>
    {
        public string Id { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Category { get; set; } = "common";
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateTranslationCommandHandler : IRequestHandler<UpdateTranslationCommand, TranslationDto>
    {
        private readonly ITranslationRepository _repository;

        public UpdateTranslationCommandHandler(ITranslationRepository repository)
        {
            _repository = repository;
        }

        public async Task<TranslationDto> Handle(UpdateTranslationCommand request, CancellationToken cancellationToken)
        {
            var result = await _repository.UpdateTranslationAsync(
                request.Id,
                request.Key,
                request.Value,
                request.Language,
                request.Category,
                request.Description,
                request.IsActive,
                cancellationToken);

            var json = global::System.Text.Json.JsonSerializer.Serialize(result);
            return global::System.Text.Json.JsonSerializer.Deserialize<TranslationDto>(json, new global::System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
        }
    }
}
