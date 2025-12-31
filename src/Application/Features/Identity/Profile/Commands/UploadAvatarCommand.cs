using Application.Features.Identity.Profile.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.Features.Identity.Profile.Commands
{
    public class UploadAvatarCommand : IRequest<Result<string>>
    {
        public Guid UserId { get; set; }
        public Stream FileStream { get; set; } = default!;
        public string FileName { get; set; } = default!;
        public string ContentType { get; set; } = default!;
    }

    public class UploadAvatarCommandHandler : IRequestHandler<UploadAvatarCommand, Result<string>>
    {
        private readonly IProfileService _profileService;

        public UploadAvatarCommandHandler(IProfileService profileService)
        {
            _profileService = profileService;
        }

        public async Task<Result<string>> Handle(UploadAvatarCommand request, CancellationToken cancellationToken)
        {
            return await _profileService.UploadAvatarAsync(request.UserId.ToString(), request.FileStream, request.FileName, request.ContentType);
        }
    }
}
