using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class ModerateEventCommentsCommand : IRequest<ApiResponseDto<ModerationResult>>
{
    public Guid EventId { get; set; }
    public Guid ModeratedBy { get; set; }
    public string Action { get; set; } = string.Empty;
    public List<Guid> CommentIds { get; set; } = new();
    public string? Reason { get; set; }
}

public class ModerationResult
{
    public int ProcessedCount { get; set; }
    public int TotalCount { get; set; }
    public string Action { get; set; } = string.Empty;
}
public class ModerateEventCommentsCommandHandler : IRequestHandler<ModerateEventCommentsCommand, ApiResponseDto<ModerationResult>>
{
    public async Task<ApiResponseDto<ModerationResult>> Handle(ModerateEventCommentsCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var result = new ModerationResult
        {
            ProcessedCount = request.CommentIds.Count,
            TotalCount = request.CommentIds.Count,
            Action = request.Action
        };
        
        return ApiResponseDto<ModerationResult>.Success(result);
    }
}
