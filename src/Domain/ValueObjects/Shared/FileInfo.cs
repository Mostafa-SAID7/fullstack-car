namespace Domain.ValueObjects.Shared;

public class FileInfo : ValueObject
{
    public string FileName { get; private set; }
    public string ContentType { get; private set; }
    public long Size { get; private set; }
    public string? Checksum { get; private set; }

    private FileInfo() { } // For EF Core

    public FileInfo(string fileName, string contentType, long size, string? checksum = null)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new ArgumentException("File name cannot be empty", nameof(fileName));
        
        if (string.IsNullOrWhiteSpace(contentType))
            throw new ArgumentException("Content type cannot be empty", nameof(contentType));
        
        if (size < 0)
            throw new ArgumentException("File size cannot be negative", nameof(size));

        FileName = fileName;
        ContentType = contentType;
        Size = size;
        Checksum = checksum;
    }

    public string GetFileExtension() => Path.GetExtension(FileName);
    
    public bool IsImage() => ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
    
    public bool IsDocument() => ContentType.StartsWith("application/", StringComparison.OrdinalIgnoreCase);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return FileName;
        yield return ContentType;
        yield return Size;
        yield return Checksum ?? string.Empty;
    }
}
