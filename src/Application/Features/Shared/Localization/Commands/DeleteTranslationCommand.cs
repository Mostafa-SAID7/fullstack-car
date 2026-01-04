using MediatR;

namespace Application.Features.Shared.Localization.Commands
{
    public class DeleteTranslationCommand : IRequest<bool>
    {
        public string Id { get; set; } = string.Empty;
    }
}
