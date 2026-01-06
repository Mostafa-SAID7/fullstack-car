namespace Domain.DomainEvents.Shared.Search;

public class SearchPerformedEvent : BaseDomainEvent
{
    public string Query { get; }
    public SearchType SearchType { get; }
    public int ResultsCount { get; }
    public TimeSpan ExecutionTime { get; }
    public Guid? UserId { get; }

    public SearchPerformedEvent(string query, SearchType searchType, int resultsCount, 
        TimeSpan executionTime, Guid? userId)
    {
        Query = query;
        SearchType = searchType;
        ResultsCount = resultsCount;
        ExecutionTime = executionTime;
        UserId = userId;
    }
}
