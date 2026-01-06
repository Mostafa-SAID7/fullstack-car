using Application.Common.Specifications;
using Domain.Entities.Community.Groups;

namespace Application.Common.Specifications.Community.Groups
{
    public class AllGroupsSpecification : BaseSpecification<Group>
    {
        public AllGroupsSpecification(int skip, int take) : base(g => !g.IsDeleted)
        {
            AddInclude(g => g.Owner);
            ApplyOrderByDescending(g => g.CreatedAt);
            ApplyPaging(skip, take);
        }
    }

    public class GroupWithDetailsSpecification : BaseSpecification<Group>
    {
        public GroupWithDetailsSpecification(Guid id) : base(g => g.Id == id && !g.IsDeleted)
        {
            AddInclude(g => g.Owner);
        }
    }

    public class GroupMembersSpecification : BaseSpecification<GroupMember>
    {
        public GroupMembersSpecification(Guid groupId, int skip, int take) : base(m => m.GroupId == groupId)
        {
            AddInclude(m => m.User);
            ApplyOrderBy(m => m.JoinedAt);
            ApplyPaging(skip, take);
        }
    }
}
