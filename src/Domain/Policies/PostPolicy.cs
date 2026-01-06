using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Enums.Community.Posts;
using Domain.Enums.Identity;
using Domain.Enums.Community.Groups;

namespace Domain.Policies
{
    public static class PostPolicy
    {
        public static bool CanEdit(Post post, ApplicationUser user)
        {
            return post.UserId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanDelete(Post post, ApplicationUser user)
        {
            return post.UserId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanView(Post post, ApplicationUser? user = null)
        {
            if (post.Status != PostStatus.Published)
                return false;

            if (post.Group != null && post.Group.Privacy == GroupPrivacy.Private)
            {
                return user != null && post.Group.Members.Any(m => m.UserId == user.Id);
            }

            return true;
        }
    }
}
