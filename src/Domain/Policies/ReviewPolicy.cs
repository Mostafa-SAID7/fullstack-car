using Domain.Entities.Community.Reviews;
using Domain.Entities.Identity;
using Domain.Enums.Identity;

namespace Domain.Policies
{
    public static class ReviewPolicy
    {
        public static bool CanEdit(Review review, User user)
        {
            return review.UserId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanDelete(Review review, User user)
        {
            return review.UserId == user.Id && user.Status == UserStatus.Active;
        }
    }
}
