namespace Domain.Exceptions;

public class UnauthorizedAccessException : DomainException
{
    public UnauthorizedAccessException(string message) : base(message)
    {
    }

    public UnauthorizedAccessException(string message, Exception innerException) : base(message, innerException)
    {
    }

    public static UnauthorizedAccessException ForAction(string action, string resource)
    {
        return new UnauthorizedAccessException($"You are not authorized to {action} {resource}.");
    }
}