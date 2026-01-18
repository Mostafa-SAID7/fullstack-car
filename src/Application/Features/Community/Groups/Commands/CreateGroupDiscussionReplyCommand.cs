using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class CreateGroupDiscussionReplyCommand : IRequest<Result<bool>>
    {
        public Guid DiscussionId { get; set; }
        public Guid UserId { get; set; }
        public CreateGroupDiscussionReplyRequest Request { get; set; } = new();
    }

    public class CreateGroupDiscussionReplyCommandHandler : IRequestHandler<CreateGroupDiscussionReplyCommand, Result<bool>>
    {
        public async Task<Result<bool>> Handle(CreateGroupDiscussionReplyCommand request, CancellationToken cancellationToken)
        {
            // TODO: Implement discussion reply logic
            return Result<bool>.Success(true);
        }
    }
}