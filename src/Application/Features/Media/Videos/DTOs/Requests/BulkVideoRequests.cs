namespace Application.Features.Media.Videos.DTOs.Requests;

public class BulkDeleteVideosRequest
{
    public List<Guid> VideoIds { get; set; } = new();
}

public class BulkPublishVideosRequest
{
    public List<Guid> VideoIds { get; set; } = new();
}

public class BulkUnpublishVideosRequest
{
    public List<Guid> VideoIds { get; set; } = new();
}

public class BulkUpdateVideoMetadataRequest
{
    public List<Guid> VideoIds { get; set; } = new();
    public BulkUpdateVideoMetadataData Metadata { get; set; } = new();
}

public class BulkUpdateVideoMetadataData
{
    public List<string>? Tags { get; set; }
    public bool? IsPublic { get; set; }
    public bool? AllowComments { get; set; }
    public string? Category { get; set; }
}

