using Domain.Entities.Community.Posts;
using Domain.Enums.Community.Posts;

namespace Domain.Specifications
{
    public class PostsByUserSpecification : BaseSpecification<Post>
    {
        public PostsByUserSpecification(Guid userId) : base(p => p.UserId == userId && !p.IsDeleted)
        {
            AddInclude(p => p.User);
            AddInclude(p => p.Group);
            ApplyOrderByDescending(p => p.CreatedAt);
        }
    }

    public class PostsByGroupSpecification : BaseSpecification<Post>
    {
        public PostsByGroupSpecification(Guid groupId) : base(p => p.GroupId == groupId && !p.IsDeleted && p.Status == PostStatus.Published)
        {
            AddInclude(p => p.User);
            AddInclude(p => p.Group);
            ApplyOrderByDescending(p => p.CreatedAt);
        }
    }

    public class PublicPostsSpecification : BaseSpecification<Post>
    {
        public PublicPostsSpecification(int skip, int take) : base(p => !p.IsDeleted && p.Status == PostStatus.Published)
        {
            AddInclude(p => p.User);
            AddInclude(p => p.Group);
            ApplyOrderByDescending(p => p.CreatedAt);
            ApplyPaging(skip, take);
        }
    }
}