using Application.Features.Shared.Storage.Interfaces;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Storage.Services
{
    public class FileService : IFileService
    {
        private readonly ILogger<FileService> _logger;
        private readonly string _uploadPath;

        public FileService(ILogger<FileService> logger)
        {
            _logger = logger;
            _uploadPath = global::System.IO.Path.Combine(global::System.IO.Directory.GetCurrentDirectory(), "uploads");
            global::System.IO.Directory.CreateDirectory(_uploadPath);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            return await UploadFileAsync(fileStream, fileName, contentType, CancellationToken.None);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken)
        {
            var fileId = Guid.NewGuid().ToString();
            var filePath = global::System.IO.Path.Combine(_uploadPath, fileId);
            
            using var fileStreamOutput = new global::System.IO.FileStream(filePath, global::System.IO.FileMode.Create);
            await fileStream.CopyToAsync(fileStreamOutput, cancellationToken);
            
            _logger.LogInformation("File uploaded: {FileName} -> {FileId}", fileName, fileId);
            return fileId;
        }

        public async Task<Stream> DownloadFileAsync(string fileId)
        {
            return await DownloadFileAsync(fileId, CancellationToken.None);
        }

        public async Task<Stream> DownloadFileAsync(string fileId, CancellationToken cancellationToken)
        {
            var filePath = global::System.IO.Path.Combine(_uploadPath, fileId);
            if (!global::System.IO.File.Exists(filePath))
                throw new global::System.IO.FileNotFoundException($"File with ID {fileId} not found");

            return await Task.FromResult(new global::System.IO.FileStream(filePath, global::System.IO.FileMode.Open, global::System.IO.FileAccess.Read));
        }

        public async Task DeleteFileAsync(string fileId)
        {
            await DeleteFileAsync(fileId, CancellationToken.None);
        }

        public async Task DeleteFileAsync(string fileId, CancellationToken cancellationToken)
        {
            var filePath = global::System.IO.Path.Combine(_uploadPath, fileId);
            if (global::System.IO.File.Exists(filePath))
            {
                global::System.IO.File.Delete(filePath);
                _logger.LogInformation("File deleted: {FileId}", fileId);
            }
            await Task.CompletedTask;
        }

        public async Task<bool> FileExistsAsync(string fileId)
        {
            return await FileExistsAsync(fileId, CancellationToken.None);
        }

        public async Task<bool> FileExistsAsync(string fileId, CancellationToken cancellationToken)
        {
            var filePath = global::System.IO.Path.Combine(_uploadPath, fileId);
            return await Task.FromResult(global::System.IO.File.Exists(filePath));
        }

        public async Task<long> GetFileSizeAsync(string fileId)
        {
            return await GetFileSizeAsync(fileId, CancellationToken.None);
        }

        public async Task<long> GetFileSizeAsync(string fileId, CancellationToken cancellationToken)
        {
            var filePath = global::System.IO.Path.Combine(_uploadPath, fileId);
            if (!global::System.IO.File.Exists(filePath))
                throw new global::System.IO.FileNotFoundException($"File with ID {fileId} not found");

            var fileInfo = new global::System.IO.FileInfo(filePath);
            return await Task.FromResult(fileInfo.Length);
        }
    }
}