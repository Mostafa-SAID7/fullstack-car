using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using MediatR;

namespace Application.Features.Community.Friends.Queries;

public class GetFriendSuggestionsQuery : IRequest<Result<List<FriendSuggestionDto>>>
{
    public Guid UserId { get; set; }
    public int PageSize { get; set; } = 10;
}

public class GetFriendSuggestionsQueryHandler : IRequestHandler<GetFriendSuggestionsQuery, Result<List<FriendSuggestionDto>>>
{
    public async Task<Result<List<FriendSuggestionDto>>> Handle(GetFriendSuggestionsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement friend suggestions logic
        await Task.CompletedTask;
        
        var suggestions = new List<FriendSuggestionDto>();
        
        return Result<List<FriendSuggestionDto>>.Success(suggestions);
    }
}
