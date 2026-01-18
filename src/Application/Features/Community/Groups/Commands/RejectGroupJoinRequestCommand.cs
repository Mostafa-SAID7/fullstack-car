using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class RejectGroupJoinRequestCommand : IRequest<Result<bool>>
    {
        public Guid RequestId { get; set; }
        public Guid RejectedBy { get; set; }
        public string? Reason { get; set; }
    }

    public class RejectGroupJoinRequestCommandHandler : IRequestHandler<RejectGroupJoinRequestCommand, Result<bool>>
    {
        private readonly IRepository<GroupJoinRequest> _joinRequestRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RejectGroupJoinRequestCommandHandler(
            IRepository<GroupJoinRequest> joinRequestRepository,
            IUnitOfWork unitOfWork)
        {
            _joinRequestRepository = joinRequestRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RejectGroupJoinRequestCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var joinRequest = await _joinRequestRepository.GetByIdAsync(request.RequestId, cancellationToken);
                if (joinRequest == null)
                {
                    return Result<bool>.Failure("Join request not found");
                }

                joinRequest.Status = "Rejected";
                joinRequest.ProcessedAt = DateTime.UtcNow;
                joinRequest.ProcessedBy = request.RejectedBy;
                joinRequest.RejectionReason = request.Reason;

                await _joinRequestRepository.UpdateAsync(joinRequest, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to reject join request: {ex.Message}");
            }
        }
    }
}