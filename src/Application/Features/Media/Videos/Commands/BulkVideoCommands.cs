using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Responses;
using MediatR;

namespace Application.Features.Media.Videos.Commands;

public class BulkDeleteVideosCommand : IRequest<Result<BulkOperationResult>>
{
    public List<Guid> VideoIds { get; set; } = new();
    public Guid UserId { get; set; }
}

public class BulkPublishVideosCommand : IRequest<Result<BulkOperationResult>>
{
    public List<Guid> VideoIds { get; set; } = new();
    public Guid UserId { get; set; }
}

public class BulkUnpublishVideosCommand : IRequest<Result<BulkOperationResult>>
{
    public List<Guid> VideoIds { get; set; } = new();
    public Guid UserId { get; set; }
}

public class BulkUpdateVideoMetadataCommand : IRequest<Result<BulkOperationResult>>
{
    public List<Guid> VideoIds { get; set; } = new();
    public Guid UserId { get; set; }
    public BulkUpdateVideoMetadata Metadata { get; set; } = new();
}

public class BulkUpdateVideoMetadata
{
    public List<string>? Tags { get; set; }
    public bool? IsPublic { get; set; }
    public bool? AllowComments { get; set; }
    public string? Category { get; set; }
}

public class BulkOperationResult
{
    public int TotalRequested { get; set; }
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public List<BulkOperationError> Errors { get; set; } = new();
    public bool IsSuccess => FailureCount == 0;
}

public class BulkOperationError
{
    public Guid ItemId { get; set; }
    public string Error { get; set; } = string.Empty;
}