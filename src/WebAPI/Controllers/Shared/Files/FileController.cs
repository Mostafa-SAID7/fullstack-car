using Application.Common.Interfaces.Storage;
using Application.Common.Interfaces.Logging;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Shared.Files
{
    [Authorize]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/files")]
    public class FileController : BaseController
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly IImageProcessingService _imageProcessingService;
        private readonly IAdvancedLogger<FileController> _logger;

        public FileController(
            IFileStorageService fileStorageService,
            IImageProcessingService imageProcessingService,
            IAdvancedLogger<FileController> logger)
        {
            _fileStorageService = fileStorageService;
            _imageProcessingService = imageProcessingService;
            _logger = logger;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB limit
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string folder = "uploads")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file provided");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "FileUpload", new { FileName = file.FileName, FileSize = file.Length, Folder = folder });

                var result = await _fileStorageService.UploadFileAsync(file, folder);

                if (result.Success)
                {
                    _logger.LogBusinessEvent("FileUploaded", new { 
                        FileName = result.FileName, 
                        FileSize = result.FileSize, 
                        FilePath = result.FilePath 
                    }, userId);

                    return Ok(new
                    {
                        success = true,
                        fileName = result.FileName,
                        filePath = result.FilePath,
                        fileUrl = result.FileUrl,
                        fileSize = result.FileSize,
                        contentType = result.ContentType,
                        thumbnailUrl = result.ThumbnailUrl
                    });
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("upload-multiple")]
        [RequestSizeLimit(50 * 1024 * 1024)] // 50MB limit for multiple files
        public async Task<IActionResult> UploadMultipleFiles(IFormFileCollection files, [FromQuery] string folder = "uploads")
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest("No files provided");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "MultipleFileUpload", new { FileCount = files.Count, Folder = folder });

                var results = await _fileStorageService.UploadFilesAsync(files, folder);

                var successfulUploads = results.Where(r => r.Success).ToList();
                var failedUploads = results.Where(r => !r.Success).ToList();

                _logger.LogBusinessEvent("MultipleFilesUploaded", new { 
                    TotalFiles = files.Count,
                    SuccessfulUploads = successfulUploads.Count,
                    FailedUploads = failedUploads.Count
                }, userId);

                return Ok(new
                {
                    success = true,
                    totalFiles = files.Count,
                    successfulUploads = successfulUploads.Count,
                    failedUploads = failedUploads.Count,
                    files = results.Select(r => new
                    {
                        success = r.Success,
                        fileName = r.FileName,
                        filePath = r.FilePath,
                        fileUrl = r.FileUrl,
                        fileSize = r.FileSize,
                        contentType = r.ContentType,
                        thumbnailUrl = r.ThumbnailUrl,
                        errors = r.Errors
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading multiple files");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("download/{*filePath}")]
        public async Task<IActionResult> DownloadFile(string filePath)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "FileDownload", new { FilePath = filePath });

                var result = await _fileStorageService.DownloadFileAsync(filePath);

                if (result.Success && result.FileStream != null)
                {
                    _logger.LogBusinessEvent("FileDownloaded", new { 
                        FilePath = filePath,
                        FileName = result.FileName,
                        FileSize = result.FileSize
                    }, userId);

                    return File(result.FileStream, result.ContentType ?? "application/octet-stream", result.FileName);
                }

                return NotFound(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading file: {FilePath}", filePath);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("stream/{*filePath}")]
        public async Task<IActionResult> StreamFile(string filePath)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "FileStream", new { FilePath = filePath });

                var fileStream = await _fileStorageService.GetFileStreamAsync(filePath);
                
                if (fileStream != null)
                {
                    var contentType = GetContentType(filePath);
                    return File(fileStream, contentType, enableRangeProcessing: true);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error streaming file: {FilePath}", filePath);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{*filePath}")]
        public async Task<IActionResult> DeleteFile(string filePath)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "FileDelete", new { FilePath = filePath });

                var success = await _fileStorageService.DeleteFileAsync(filePath);

                if (success)
                {
                    _logger.LogBusinessEvent("FileDeleted", new { FilePath = filePath }, userId);
                    return Ok(new { success = true, message = "File deleted successfully" });
                }

                return NotFound(new { success = false, message = "File not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("info/{*filePath}")]
        public async Task<IActionResult> GetFileInfo(string filePath)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "GetFileInfo", new { FilePath = filePath });

                var fileInfo = await _fileStorageService.GetFileInfoAsync(filePath);

                return Ok(new
                {
                    success = true,
                    fileName = fileInfo.Name,
                    fileSize = fileInfo.Length,
                    createdAt = fileInfo.CreationTime,
                    modifiedAt = fileInfo.LastWriteTime,
                    extension = fileInfo.Extension,
                    directory = fileInfo.DirectoryName
                });
            }
            catch (FileNotFoundException)
            {
                return NotFound(new { success = false, message = "File not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting file info: {FilePath}", filePath);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListFiles([FromQuery] string folder = "uploads")
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "ListFiles", new { Folder = folder });

                var files = await _fileStorageService.GetFilesInFolderAsync(folder);

                return Ok(new
                {
                    success = true,
                    folder = folder,
                    fileCount = files.Count,
                    files = files
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing files in folder: {Folder}", folder);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("process-image")]
        public async Task<IActionResult> ProcessImage(IFormFile image, [FromBody] ImageProcessingRequest request)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest("No image provided");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "ImageProcessing", new { 
                    FileName = image.FileName, 
                    Operation = request.Operation 
                });

                using var imageStream = image.OpenReadStream();
                var outputPath = Path.Combine("processed", $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}");

                ImageProcessingResult result = request.Operation.ToLower() switch
                {
                    "resize" => await _imageProcessingService.ResizeImageAsync(imageStream, request.Width ?? 800, request.Height ?? 600, outputPath),
                    "thumbnail" => await _imageProcessingService.CreateThumbnailAsync(imageStream, request.Size ?? 150, outputPath),
                    "crop" => await _imageProcessingService.CropImageAsync(imageStream, request.X ?? 0, request.Y ?? 0, request.Width ?? 100, request.Height ?? 100, outputPath),
                    "optimize" => await _imageProcessingService.OptimizeImageAsync(imageStream, outputPath, request.Quality ?? 85),
                    _ => throw new ArgumentException("Invalid operation")
                };

                if (result.Success)
                {
                    _logger.LogBusinessEvent("ImageProcessed", new { 
                        Operation = request.Operation,
                        OutputPath = result.OutputPath,
                        FileSize = result.FileSize
                    }, userId);

                    return Ok(new
                    {
                        success = true,
                        outputPath = result.OutputPath,
                        fileSize = result.FileSize,
                        width = result.Width,
                        height = result.Height
                    });
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing image");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Anonymous";
        }

        private static string GetContentType(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".pdf" => "application/pdf",
                ".txt" => "text/plain",
                ".json" => "application/json",
                ".xml" => "application/xml",
                ".zip" => "application/zip",
                ".mp4" => "video/mp4",
                ".mp3" => "audio/mpeg",
                _ => "application/octet-stream"
            };
        }
    }

    public class ImageProcessingRequest
    {
        public string Operation { get; set; } = string.Empty;
        public int? Width { get; set; }
        public int? Height { get; set; }
        public int? Size { get; set; }
        public int? X { get; set; }
        public int? Y { get; set; }
        public int? Quality { get; set; }
    }
}