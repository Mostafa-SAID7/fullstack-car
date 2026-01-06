using Domain.Entities.Admin.Dashboard;
using Domain.Entities.Identity;

namespace Domain.Rules.Admin;

public class DashboardCanBeSharedRule : BusinessRule
{
    private readonly DashboardLayout _dashboard;
    private readonly ApplicationUser _user;

    public DashboardCanBeSharedRule(DashboardLayout dashboard, ApplicationUser user)
    {
        _dashboard = dashboard;
        _user = user;
    }

    public override bool IsBroken()
    {
        // Only the creator or users with share permission can share
        if (_dashboard.CreatedByUserId != _user.Id)
        {
            var hasSharePermission = _dashboard.Permissions
                .Any(p => (p.UserId == _user.Id || (p.RoleId.HasValue && _user.UserRoles.Any(ur => ur.RoleId == p.RoleId))) 
                         && p.CanShare);
            
            if (!hasSharePermission)
                return true;
        }

        // Cannot share private dashboards unless explicitly allowed
        if (!_dashboard.IsPublic && _dashboard.CreatedByUserId != _user.Id)
            return true;

        return false;
    }

    public override string Message => "Dashboard cannot be shared by this user.";
}
