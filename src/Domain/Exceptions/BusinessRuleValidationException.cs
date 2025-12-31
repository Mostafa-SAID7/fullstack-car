using Domain.Rules;

namespace Domain.Exceptions
{
    public class BusinessRuleValidationException : DomainException
    {
        public BusinessRule BrokenRule { get; }

        public BusinessRuleValidationException(BusinessRule brokenRule) 
            : base(brokenRule.Message)
        {
            BrokenRule = brokenRule;
        }
    }
}