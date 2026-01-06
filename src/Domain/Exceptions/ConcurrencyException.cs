namespace Domain.Exceptions;

public class ConcurrencyException : DomainException
{
    public ConcurrencyException(string message) : base(message)
    {
    }

    public ConcurrencyException(string message, Exception innerException) : base(message, innerException)
    {
    }

    public static ConcurrencyException ForEntity(string entityName, object id)
    {
        return new ConcurrencyException($"The {entityName} with id '{id}' was modified by another user. Please refresh and try again.");
    }
}
