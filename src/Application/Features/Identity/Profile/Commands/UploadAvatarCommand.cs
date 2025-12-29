using Application.Common.Interfaces.Identity;
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
        private readonly IUserService _userService;

        public UploadAvatarCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Result<string>> Handle(UploadAvatarCommand request, CancellationToken cancellationToken)
        {
            return await _userService.UploadAvatarAsync(request.UserId, request.FileStream, request.FileName, request.ContentType);
        }
    }
}
