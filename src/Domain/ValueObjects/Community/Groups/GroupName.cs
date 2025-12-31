using Domain.Base;

namespace Domain.ValueObjects.Community.Groups
{
    public class GroupName : ValueObject
    {
        public string Value { get; private set; }

        private GroupName(string value)
        {
            Value = value;
        }

        public static GroupName Create(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Group name cannot be empty", nameof(name));

            if (name.Length < 3)
                throw new ArgumentException("Group name must be at least 3 characters long", nameof(name));

            if (name.Length > 100)
                throw new ArgumentException("Group name cannot exceed 100 characters", nameof(name));

            return new GroupName(name.Trim());
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        public static implicit operator string(GroupName groupName) => groupName.Value;
        public override string ToString() => Value;
    }
}