using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class UnbanGroupMemberCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public Guid UnbannedBy { get; set; }
    }

    public class UnbanGroupMemberCommandHandler : IRequestHandler<UnbanGroupMemberCommand, Result<bool>>
    {
        private readonly IRepository<GroupBan> _banRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UnbanGroupMemberCommandHandler(
            IRepository<GroupBan> banRepository,
            IUnitOfWork unitOfWork)
        {
            _banRepository = banRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(UnbanGroupMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var ban = await _banRepository.FirstOrDefaultAsync(
                    b => b.GroupId == request.GroupId && b.UserId == request.UserId && b.IsActive, 
                    cancellationToken);

                if (ban == null)
                {
                    return Result<bool>.Failure("Active ban not found");
                }

                ban.IsActive = false;
                ban.UnbannedAt = DateTime.UtcNow;
                ban.UnbannedBy = request.UnbannedBy;

                await _banRepository.UpdateAsync(ban, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to unban member: {ex.Message}");
            }
        }
    }
}