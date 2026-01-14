using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Shared.Localization.Commands
{
    public class DeleteTranslationCommand : IRequest<bool>
    {
        public string Id { get; set; } = string.Empty;
    }

    public class DeleteTranslationCommandHandler : IRequestHandler<DeleteTranslationCommand, bool>
    {
        private readonly ITranslationRepository _repository;

        public DeleteTranslationCommandHandler(ITranslationRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(DeleteTranslationCommand request, CancellationToken cancellationToken)
        {
            return await _repository.DeleteTranslationAsync(request.Id, cancellationToken);
        }
    }
}
