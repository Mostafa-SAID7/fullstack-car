using Microsoft.AspNetCore.Http;
using Application.Features.Media.Shared.DTOs.Requests;

namespace Application.Features.Media.Videos.DTOs.Requests;

public class VideoChunkUploadRequest
{
    public IFormFile Chunk { get; set; } = null!;
    public string UploadId { get; set; } = string.Empty;
    public int ChunkNumber { get; set; }
    public int TotalChunks { get; set; }
    public string FileName { get; set; } = string.Empty;
    public UploadVideoRequest? Metadata { get; set; }
}
