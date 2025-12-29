namespace Domain.Rules
{
    public abstract class BusinessRule
    {
        public abstract string Message { get; }
        public abstract bool IsBroken();
    }
}