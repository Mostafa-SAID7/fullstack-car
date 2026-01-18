using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Groups;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupByIdQuery : IRequest<Result<GroupDto>>, ICacheableRequest
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }

        public string CacheKey => $"Group_{Id}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(15);
        public string[]? CacheTags => new[] { "Groups" };
    }

    public class GetGroupByIdQueryHandler : IRequestHandler<GetGroupByIdQuery, Result<GroupDto>>
    {
        private readonly IRepository<Group> _groupRepository;

        public GetGroupByIdQueryHandler(IRepository<Group> groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<GroupDto>> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
        {
            var specification = new GroupWithDetailsSpecification(request.Id);
            var group = await _groupRepository.FirstOrDefaultAsync(specification.Criteria!, cancellationToken);
            
            if (group == null)
            {
                return Result<GroupDto>.Failure(new[] { "Group not found" });
            }

            var groupDto = new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                ImageUrl = group.ImageUrl,
                Category = group.Category,
                IsPublic = group.IsPublic,
                MemberCount = group.MemberCount,
                PostCount = group.PostCount,
                CreatedAt = group.CreatedAt,
                UpdatedAt = group.UpdatedAt,
                OwnerId = group.OwnerId,
                OwnerFirstName = group.Owner.FirstName,
                OwnerLastName = group.Owner.LastName,
                OwnerProfileImageUrl = group.Owner.ProfileImageUrl
            };

            return Result<GroupDto>.Success(groupDto);
        }
    }
}
