using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Groups;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupMembersQuery : IRequest<Result<PaginatedList<GroupMemberDto>>>, ICacheableRequest
    {
        public Guid GroupId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Role { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }

        public string CacheKey => $"GroupMembers_{GroupId}_{PageNumber}_{PageSize}_{Role}_{SearchTerm}_{SortBy}_{SortDescending}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(5);
        public string[]? CacheTags => new[] { $"GroupMembers_{GroupId}" };
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
            
            var members = await _memberRepository.ListAsync(specification.Criteria!, cancellationToken);
            var totalCount = await _memberRepository.CountAsync(specification.Criteria!, cancellationToken);

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