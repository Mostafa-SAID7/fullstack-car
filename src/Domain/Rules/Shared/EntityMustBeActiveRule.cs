namespace Domain.Rules.Shared;

public class EntityMustBeActiveRule : BusinessRule
{
    private readonly Status _status;
    private readonly string _entityName;

    public EntityMustBeActiveRule(Status status, string entityName)
    {
        _status = status;
        _entityName = entityName;
    }

    public override string Message => $"{_entityName} must be active";

    public override bool IsBroken() => _status != Status.Active;
}