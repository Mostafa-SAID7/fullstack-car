using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Domain.Specifications;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupMembersQuery : IRequest<Result<PaginatedList<GroupMemberDto>>>, ICacheableRequest
    {
        public Guid GroupId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string CacheKey => $"GroupMembers_{GroupId}_{PageNumber}_{PageSize}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
        public string? CacheTag => $"GroupMembers_{GroupId}";
    }

    public class GetGroupMembersQueryHandler : IRequestHandler<GetGroupMembersQuery, Result<PaginatedList<GroupMemberDto>>>
    {
        private readonly IRepository<GroupMember> _memberRepository;

        public GetGroupMembersQueryHandler(IRepository<GroupMember> memberRepository)
        {
            _memberRepository = memberRepository;
        }

        public async Task<Result<PaginatedList<GroupMemberDto>>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
        {
            var skip = (request.PageNumber - 1) * request.PageSize;
            var specification = new GroupMembersSpecification(request.GroupId, skip, request.PageSize);
            
            var members = await _memberRepository.ListAsync(specification, cancellationToken);
            var totalCount = await _memberRepository.CountAsync(specification, cancellationToken);

            var memberDtos = members.Select(m => new GroupMemberDto
            {
                UserId = m.UserId,
                UserFirstName = m.User.FirstName,
                UserLastName = m.User.LastName,
                UserProfileImageUrl = m.User.ProfileImageUrl,
                Role = m.Role,
                JoinedAt = m.JoinedAt
            }).ToList();

            var paginatedList = new PaginatedList<GroupMemberDto>(memberDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<GroupMemberDto>>.Success(paginatedList);
        }
    }
}
