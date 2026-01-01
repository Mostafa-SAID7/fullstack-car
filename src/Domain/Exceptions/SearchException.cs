namespace Domain.Exceptions;

public class SearchException : DomainException
{
    public SearchException(string message) : base(message)
    {
    }

    public SearchException(string message, Exception innerException) : base(message, innerException)
    {
    }

    public static SearchException InvalidQuery(string query)
    {
        return new SearchException($"Invalid search query: '{query}'");
    }

    public static SearchException IndexNotAvailable(string entityType)
    {
        return new SearchException($"Search index not available for entity type: '{entityType}'");
    }

    public static SearchException TooManyResults(int count, int maxAllowed)
    {
        return new SearchException($"Search returned too many results ({count}). Maximum allowed: {maxAllowed}");
    }
}