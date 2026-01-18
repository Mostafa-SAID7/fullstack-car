using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class BulkApproveEventAttendeesCommand : IRequest<Result<BulkApprovalResultDto>>
{
    public Guid EventId { get; set; }
    public List<Guid> AttendeeIds { get; set; } = new();
    public Guid ApprovedBy { get; set; }
}

public class BulkApprovalResultDto
{
    public int ApprovedCount { get; set; }
    public int FailedCount { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class BulkApproveEventAttendeesCommandHandler : IRequestHandler<BulkApproveEventAttendeesCommand, Result<BulkApprovalResultDto>>
{
    public async Task<Result<BulkApprovalResultDto>> Handle(BulkApproveEventAttendeesCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement bulk approval logic
        await Task.CompletedTask;
        
        var result = new BulkApprovalResultDto
        {
            ApprovedCount = request.AttendeeIds.Count,
            FailedCount = 0
        };
        
        return Result<BulkApprovalResultDto>.Success(result);
    }
}