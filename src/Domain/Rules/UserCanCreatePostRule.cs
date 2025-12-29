using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;
using Domain.Enums.Community.Posts;
using Domain.Enums.Identity;

namespace Domain.Rules
{
    public class UserCanCreatePostRule : BusinessRule
    {
        private readonly User _user;

        public UserCanCreatePostRule(User user)
        {
            _user = user;
        }

        public override string Message => "User is not allowed to create posts";

        public override bool IsBroken()
        {
            return _user.Status != UserStatus.Active || _user.IsDeleted;
        }
    }
}