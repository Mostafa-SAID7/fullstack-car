using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class RSVPToGroupEventCommand : IRequest<Result<bool>>
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public string RSVPType { get; set; } = string.Empty;
    }

    public class RSVPToGroupEventCommandHandler : IRequestHandler<RSVPToGroupEventCommand, Result<bool>>
    {
        public async Task<Result<bool>> Handle(RSVPToGroupEventCommand request, CancellationToken cancellationToken)
        {
            // TODO: Implement RSVP logic
            return Result<bool>.Success(true);
        }
    }
}