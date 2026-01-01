namespace Domain.Rules.Shared;

public class EntityMustExistRule<T> : BusinessRule where T : BaseEntity
{
    private readonly T? _entity;
    private readonly string _entityName;

    public EntityMustExistRule(T? entity, string entityName = "")
    {
        _entity = entity;
        _entityName = string.IsNullOrEmpty(entityName) ? typeof(T).Name : entityName;
    }

    public override string Message => $"{_entityName} must exist";

    public override bool IsBroken() => _entity == null || _entity.IsDeleted;
}