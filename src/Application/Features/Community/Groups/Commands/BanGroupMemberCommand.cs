using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class BanGroupMemberCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public Guid BannedBy { get; set; }
        public BanGroupMemberRequest Request { get; set; } = new();
    }

    public class BanGroupMemberCommandHandler : IRequestHandler<BanGroupMemberCommand, Result<bool>>
    {
        private readonly IRepository<GroupBan> _banRepository;
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BanGroupMemberCommandHandler(
            IRepository<GroupBan> banRepository,
            IRepository<GroupMember> memberRepository,
            IUnitOfWork unitOfWork)
        {
            _banRepository = banRepository;
            _memberRepository = memberRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(BanGroupMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Remove member if exists
                var member = await _memberRepository.FirstOrDefaultAsync(m => m.GroupId == request.GroupId && m.UserId == request.UserId, cancellationToken);
                if (member != null)
                {
                    await _memberRepository.DeleteAsync(member, cancellationToken);
                }

                // Create ban record
                var ban = new GroupBan
                {
                    GroupId = request.GroupId,
                    UserId = request.UserId,
                    BannedBy = request.BannedBy,
                    Reason = request.Request.Reason,
                    BannedAt = DateTime.UtcNow,
                    BanUntil = request.Request.BanUntil,
                    IsPermanent = request.Request.PermanentBan
                };

                await _banRepository.AddAsync(ban, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to ban member: {ex.Message}");
            }
        }
    }
}
