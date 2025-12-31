using Domain.Entities.Identity;

namespace Domain.Rules.Admin;

public class UserCanBeSuspendedRule : BusinessRule
{
    private readonly ApplicationUser _user;
    private readonly ApplicationUser _suspendingUser;

    public UserCanBeSuspendedRule(ApplicationUser user, ApplicationUser suspendingUser)
    {
        _user = user;
        _suspendingUser = suspendingUser;
    }

    public override bool IsBroken()
    {
        // User cannot suspend themselves
        if (_user.Id == _suspendingUser.Id)
            return true;

        // Cannot suspend super admin users (assuming role check would be here)
        // This would need to be implemented based on your role system
        
        // User is already suspended
        if (_user.IsSuspended)
            return true;

        return false;
    }

    public override string Message => "User cannot be suspended under current conditions.";
}