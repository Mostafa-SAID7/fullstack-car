using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Groups;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupByIdQuery : IRequest<Result<GroupDto>>, ICacheableRequest
    {
        public Guid Id { get; set; }

        public string CacheKey => $"Group_{Id}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(15);
        public string? CacheTag => "Groups";
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
            var group = await _groupRepository.FirstOrDefaultAsync(specification, cancellationToken);
            
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
                Type = group.Type,
                Privacy = group.Privacy,
                MembersCount = group.MembersCount,
                PostsCount = group.PostsCount,
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
