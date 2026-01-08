namespace Application.Features.Media.Analytics.DTOs;

public class ExportDataDto
{
    public byte[] Data { get; set; } = Array.Empty<byte>();
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string Format { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public ExportMetadataDto Metadata { get; set; } = new();
}

public class ExportMetadataDto
{
    public string ExportType { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int RecordCount { get; set; }
    public List<string> Columns { get; set; } = new();
    public Dictionary<string, object> Filters { get; set; } = new();
    public string RequestedBy { get; set; } = string.Empty;
}