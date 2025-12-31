namespace Domain.Rules
{
    public class UserCanJoinGroupRule : BusinessRule
    {
        private readonly bool _isGroupPublic;
        private readonly bool _isUserBanned;
        private readonly int _currentMemberCount;
        private readonly int _maxMemberCount;

        public UserCanJoinGroupRule(bool isGroupPublic, bool isUserBanned, int currentMemberCount, int maxMemberCount)
        {
            _isGroupPublic = isGroupPublic;
            _isUserBanned = isUserBanned;
            _currentMemberCount = currentMemberCount;
            _maxMemberCount = maxMemberCount;
        }

        public override bool IsBroken()
        {
            return _isUserBanned || 
                   (!_isGroupPublic) || 
                   (_currentMemberCount >= _maxMemberCount);
        }

        public override string Message => "User cannot join this group due to restrictions or capacity limits.";
    }
}