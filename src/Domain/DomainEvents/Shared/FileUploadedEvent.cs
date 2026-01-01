namespace Domain.DomainEvents.Shared;

public class FileUploadedEvent : BaseDomainEvent
{
    public Guid FileId { get; }
    public string FileName { get; }
    public long FileSize { get; }
    public Guid? UploadedByUserId { get; }

    public FileUploadedEvent(Guid fileId, string fileName, long fileSize, Guid? uploadedByUserId)
    {
        FileId = fileId;
        FileName = fileName;
        FileSize = fileSize;
        UploadedByUserId = uploadedByUserId;
    }
}