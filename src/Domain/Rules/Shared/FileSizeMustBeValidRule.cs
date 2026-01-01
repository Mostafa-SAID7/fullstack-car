namespace Domain.Rules.Shared;

public class FileSizeMustBeValidRule : BusinessRule
{
    private readonly long _fileSize;
    private readonly long _maxFileSize;

    public FileSizeMustBeValidRule(long fileSize, long maxFileSize)
    {
        _fileSize = fileSize;
        _maxFileSize = maxFileSize;
    }

    public override string Message => $"File size ({_fileSize} bytes) exceeds maximum allowed size ({_maxFileSize} bytes)";

    public override bool IsBroken() => _fileSize > _maxFileSize || _fileSize <= 0;
}