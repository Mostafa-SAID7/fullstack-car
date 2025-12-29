using Domain.Entities;
using Domain.Enums;

namespace Domain.Policies
{
    public static class PostPolicy
    {
        public static bool CanEdit(Post post, User user)
        {
            return post.UserId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanDelete(Post post, User user)
        {
            return post.UserId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanView(Post post, User? user = null)
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