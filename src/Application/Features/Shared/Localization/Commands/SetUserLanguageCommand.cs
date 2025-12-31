using MediatR;
using Application.Features.Shared.Localization.Interfaces;

namespace Application.Features.Shared.Localization.Commands
{
    public class SetUserLanguageCommand : IRequest<object>
    {
        public string Language { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }

    public class SetUserLanguageCommandHandler : IRequestHandler<SetUserLanguageCommand, object>
    {
        private readonly ILanguageDetector _languageDetector;

        public SetUserLanguageCommandHandler(ILanguageDetector languageDetector)
        {
            _languageDetector = languageDetector;
        }

        public async Task<object> Handle(SetUserLanguageCommand request, CancellationToken cancellationToken)
        {
            if (!await _languageDetector.IsLanguageSupportedAsync(request.Language))
            {
                var supportedLanguages = await _languageDetector.GetSupportedLanguagesAsync();
                throw new ArgumentException($"Unsupported language: {request.Language}");
            }

            await _languageDetector.SetUserLanguageAsync(request.UserId, request.Language); // Assuming LanguageDetector handles per-user setting logic

            return new 
            { 
                Message = "Language preference updated successfully", 
                Language = request.Language,
                Direction = request.Language.StartsWith("ar-") ? "rtl" : "ltr"
            };
        }
    }
}
