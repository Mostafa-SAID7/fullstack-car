using Application.Common.Interfaces.Storage;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Services.Storage
{
    public class FileService : IFileService
    {
        private readonly ILogger<FileService> _logger;
        private readonly string _uploadPath;

        public FileService(ILogger<FileService> logger)
        {
            _logger = logger;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            Directory.CreateDirectory(_uploadPath);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            return await UploadFileAsync(fileStream, fileName, contentType, CancellationToken.None);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken)
        {
            var fileId = Guid.NewGuid().ToString();
            var filePath = Path.Combine(_uploadPath, fileId);
            
            using var fileStreamOutput = new FileStream(filePath, FileMode.Create);
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
            var filePath = Path.Combine(_uploadPath, fileId);
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"File with ID {fileId} not found");

            return await Task.FromResult(new FileStream(filePath, FileMode.Open, FileAccess.Read));
        }

        public async Task DeleteFileAsync(string fileId)
        {
            await DeleteFileAsync(fileId, CancellationToken.None);
        }

        public async Task DeleteFileAsync(string fileId, CancellationToken cancellationToken)
        {
            var filePath = Path.Combine(_uploadPath, fileId);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
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
            var filePath = Path.Combine(_uploadPath, fileId);
            return await Task.FromResult(File.Exists(filePath));
        }

        public async Task<long> GetFileSizeAsync(string fileId)
        {
            return await GetFileSizeAsync(fileId, CancellationToken.None);
        }

        public async Task<long> GetFileSizeAsync(string fileId, CancellationToken cancellationToken)
        {
            var filePath = Path.Combine(_uploadPath, fileId);
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"File with ID {fileId} not found");

            var fileInfo = new FileInfo(filePath);
            return await Task.FromResult(fileInfo.Length);
        }
    }
}