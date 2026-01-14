using MediatR;
using Application.Common.Interfaces;
using Application.Features.Shared.Localization.DTOs;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetResourceFilesQuery : IRequest<IEnumerable<ResourceFileDto>>
    {
    }

    public class GetResourceFilesQueryHandler : IRequestHandler<GetResourceFilesQuery, IEnumerable<ResourceFileDto>>
    {
        private readonly ITranslationRepository _repository;
        private readonly ILogger<GetResourceFilesQueryHandler> _logger;

        public GetResourceFilesQueryHandler(
            ITranslationRepository repository,
            ILogger<GetResourceFilesQueryHandler> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IEnumerable<ResourceFileDto>> Handle(GetResourceFilesQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Retrieving all physical resource files for localization");
            return await _repository.GetResourceFilesAsync(cancellationToken);
        }
    }
}
