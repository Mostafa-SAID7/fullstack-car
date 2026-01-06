using Domain.Enums.Admin.Moderation;

namespace Domain.Rules.Admin;

public class ContentCanBeModeratedRule : BusinessRule
{
    private readonly ModerationStatus _currentStatus;
    private readonly ModerationActionType _requestedAction;

    public ContentCanBeModeratedRule(ModerationStatus currentStatus, ModerationActionType requestedAction)
    {
        _currentStatus = currentStatus;
        _requestedAction = requestedAction;
    }

    public override bool IsBroken()
    {
        // Cannot moderate already resolved content
        if (_currentStatus == ModerationStatus.Resolved && _requestedAction != ModerationActionType.Restore)
            return true;

        // Cannot approve already approved content
        if (_currentStatus == ModerationStatus.Approved && _requestedAction == ModerationActionType.Approve)
            return true;

        // Cannot reject already rejected content
        if (_currentStatus == ModerationStatus.Rejected && _requestedAction == ModerationActionType.Reject)
            return true;

        return false;
    }

    public override string Message => "Content cannot be moderated with the requested action in its current state.";
}
