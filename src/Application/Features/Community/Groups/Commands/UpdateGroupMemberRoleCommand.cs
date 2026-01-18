using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class UpdateGroupMemberRoleCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid UpdatedBy { get; set; }
        public string NewRole { get; set; } = string.Empty;
    }

    public class UpdateGroupMemberRoleCommandHandler : IRequestHandler<UpdateGroupMemberRoleCommand, Result<bool>>
    {
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateGroupMemberRoleCommandHandler(
            IRepository<GroupMember> memberRepository,
            IUnitOfWork _unitOfWork)
        {
            _memberRepository = memberRepository;
            this._unitOfWork = _unitOfWork;
        }

        public async Task<Result<bool>> Handle(UpdateGroupMemberRoleCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var member = await _memberRepository.GetByIdAsync(request.MemberId, cancellationToken);
                if (member == null)
                {
                    return Result<bool>.Failure("Member not found");
                }

                member.Role = request.NewRole;
                await _memberRepository.UpdateAsync(member, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to update member role: {ex.Message}");
            }
        }
    }
}