using Domain.Entities.Community.Posts;

namespace Domain.Specifications
{
    public class PostCommentsSpecification : BaseSpecification<Comment>
    {
        public PostCommentsSpecification(Guid postId, int skip, int take)
            : base(c => c.PostId == postId && !c.IsDeleted)
        {
            AddInclude(c => c.User);
            ApplyOrderByDescending(c => c.CreatedAt);
            ApplyPaging(skip, take);
        }
    }
}
