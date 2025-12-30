using Domain.Entities.Community.Groups;
using Domain.Entities.Identity;
using Domain.Enums.Identity;

namespace Domain.Policies
{
    public static class GroupPolicy
    {
        public static bool CanEdit(Group group, ApplicationUser user)
        {
            return group.OwnerId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanDelete(Group group, ApplicationUser user)
        {
            return group.OwnerId == user.Id && user.Status == UserStatus.Active;
        }

        public static bool CanModerate(Group group, ApplicationUser user)
        {
            // Roles are handled by the Identity system in the WebAPI layer
            // This policy focuses on domain ownership
            return group.OwnerId == user.Id && user.Status == UserStatus.Active;
        }
    }
}
