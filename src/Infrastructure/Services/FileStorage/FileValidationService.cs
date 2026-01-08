using Application.Common.Interfaces;
using Application.Common.Models;
using FFMpegCore;
using Infrastructure.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.FileStorage;

public class FileValidationService : IFileValidationService
{
    private readonly FileStorageSettings _settings;
    private readonly ILogger<FileValidationService> _logger;

    public FileValidationService(
        IOptions<FileStorageSettings> settings,
        ILogger<FileValidationService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<Application.Common.Models.ValidationResult> ValidateVideoFileAsync(Stream fileStream, string fileName, string contentType, long fileSize, CancellationToken cancellationToken = default)
    {
        var result = new Application.Common.Models.ValidationResult { IsValid = true };

        try
        {
            // Check file size
            if (fileSize > _settings.MaxVideoFileSize)
            {
                result.AddError($"File size ({fileSize / (1024 * 1024)} MB) exceeds maximum allowed size ({_settings.MaxVideoFileSize / (1024 * 1024)} MB)");
            }

            // Check file extension
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if (!_settings.AllowedVideoExtensions.Contains(extension))
            {
                result.AddError($"File extension '{extension}' is not allowed. Allowed extensions: {string.Join(", ", _settings.AllowedVideoExtensions)}");
            }

            // Check MIME type
            if (!_settings.AllowedVideoMimeTypes.Contains(contentType.ToLowerInvariant()))
            {
                result.AddError($"MIME type '{contentType}' is not allowed. Allowed types: {string.Join(", ", _settings.AllowedVideoMimeTypes)}");
            }

            // Check for dangerous file names
            if (ContainsDangerousPatterns(fileName))
            {
                result.AddError("File name contains potentially dangerous patterns");
            }

            // Basic file header validation
            if (fileStream.CanSeek && fileStream.Length > 0)
            {
                var isValidVideoFile = await ValidateVideoFileHeaderAsync(fileStream, extension, cancellationToken);
                if (!isValidVideoFile)
                {
                    result.AddError("File does not appear to be a valid video file");
                }
            }

            // Virus scan (if enabled)
            if (_settings.EnableVirusScan)
            {
                var virusScanResult = await PerformVirusScanAsync(fileStream, cancellationToken);
                if (!virusScanResult.IsClean)
                {
                    result.AddError("File failed virus scan");
                }
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating video file: {FileName}", fileName);
            result.AddError($"Validation error: {ex.Message}");
            return result;
        }
    }

    public async Task<Application.Common.Models.ValidationResult> ValidateAudioFileAsync(Stream fileStream, string fileName, string contentType, long fileSize, CancellationToken cancellationToken = default)
    {
        var result = new Application.Common.Models.ValidationResult { IsValid = true };

        try
        {
            // Check file size
            if (fileSize > _settings.MaxAudioFileSize)
            {
                result.AddError($"File size ({fileSize / (1024 * 1024)} MB) exceeds maximum allowed size ({_settings.MaxAudioFileSize / (1024 * 1024)} MB)");
            }

            // Check file extension
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if (!_settings.AllowedAudioExtensions.Contains(extension))
            {
                result.AddError($"File extension '{extension}' is not allowed. Allowed extensions: {string.Join(", ", _settings.AllowedAudioExtensions)}");
            }

            // Check MIME type
            if (!_settings.AllowedAudioMimeTypes.Contains(contentType.ToLowerInvariant()))
            {
                result.AddError($"MIME type '{contentType}' is not allowed. Allowed types: {string.Join(", ", _settings.AllowedAudioMimeTypes)}");
            }

            // Check for dangerous file names
            if (ContainsDangerousPatterns(fileName))
            {
                result.AddError("File name contains potentially dangerous patterns");
            }

            // Basic file header validation
            if (fileStream.CanSeek && fileStream.Length > 0)
            {
                var isValidAudioFile = await ValidateAudioFileHeaderAsync(fileStream, extension, cancellationToken);
                if (!isValidAudioFile)
                {
                    result.AddError("File does not appear to be a valid audio file");
                }
            }

            // Virus scan (if enabled)
            if (_settings.EnableVirusScan)
            {
                var virusScanResult = await PerformVirusScanAsync(fileStream, cancellationToken);
                if (!virusScanResult.IsClean)
                {
                    result.AddError("File failed virus scan");
                }
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating audio file: {FileName}", fileName);
            result.AddError($"Validation error: {ex.Message}");
            return result;
        }
    }

    public async Task<Application.Common.Models.ValidationResult> ValidateImageFileAsync(Stream fileStream, string fileName, string contentType, long fileSize, CancellationToken cancellationToken = default)
    {
        var result = new Application.Common.Models.ValidationResult { IsValid = true };

        try
        {
            // Check file size
            if (fileSize > _settings.MaxImageFileSize)
            {
                result.AddError($"File size ({fileSize / (1024 * 1024)} MB) exceeds maximum allowed size ({_settings.MaxImageFileSize / (1024 * 1024)} MB)");
            }

            // Check file extension
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if (!_settings.AllowedImageExtensions.Contains(extension))
            {
                result.AddError($"File extension '{extension}' is not allowed. Allowed extensions: {string.Join(", ", _settings.AllowedImageExtensions)}");
            }

            // Check MIME type
            if (!_settings.AllowedImageMimeTypes.Contains(contentType.ToLowerInvariant()))
            {
                result.AddError($"MIME type '{contentType}' is not allowed. Allowed types: {string.Join(", ", _settings.AllowedImageMimeTypes)}");
            }

            // Check for dangerous file names
            if (ContainsDangerousPatterns(fileName))
            {
                result.AddError("File name contains potentially dangerous patterns");
            }

            // Basic file header validation
            if (fileStream.CanSeek && fileStream.Length > 0)
            {
                var isValidImageFile = await ValidateImageFileHeaderAsync(fileStream, extension, cancellationToken);
                if (!isValidImageFile)
                {
                    result.AddError("File does not appear to be a valid image file");
                }
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating image file: {FileName}", fileName);
            result.AddError($"Validation error: {ex.Message}");
            return result;
        }
    }

    public async Task<MediaMetadata> ExtractVideoMetadataAsync(Stream videoStreamInput, string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            // Create a temporary file for FFMpeg processing
            var tempFilePath = Path.GetTempFileName();
            var extension = Path.GetExtension(fileName);
            var tempVideoPath = Path.ChangeExtension(tempFilePath, extension);

            try
            {
                // Copy stream to temporary file
                using (var fileStream = new FileStream(tempVideoPath, FileMode.Create))
                {
                    videoStreamInput.Position = 0;
                    await videoStreamInput.CopyToAsync(fileStream, cancellationToken);
                }

                // Extract metadata using FFMpeg
                var mediaInfo = await FFProbe.AnalyseAsync(tempVideoPath, cancellationToken: cancellationToken);

                var metadata = new MediaMetadata
                {
                    Duration = mediaInfo.Duration,
                    Format = mediaInfo.Format.FormatName,
                    Bitrate = (long)mediaInfo.Format.BitRate
                };

                var videoStream = mediaInfo.VideoStreams.FirstOrDefault();
                if (videoStream != null)
                {
                    metadata.Width = videoStream.Width;
                    metadata.Height = videoStream.Height;
                    metadata.FrameRate = videoStream.FrameRate;
                    metadata.Codec = videoStream.CodecName;
                }

                var audioStream = mediaInfo.AudioStreams.FirstOrDefault();
                if (audioStream != null)
                {
                    metadata.SampleRate = audioStream.SampleRateHz;
                    metadata.Channels = audioStream.Channels;
                }

                return metadata;
            }
            finally
            {
                // Clean up temporary files
                if (File.Exists(tempFilePath))
                    File.Delete(tempFilePath);
                if (File.Exists(tempVideoPath))
                    File.Delete(tempVideoPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting video metadata: {FileName}", fileName);
            return new MediaMetadata();
        }
    }

    public async Task<MediaMetadata> ExtractAudioMetadataAsync(Stream audioStream, string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            // Create a temporary file for FFMpeg processing
            var tempFilePath = Path.GetTempFileName();
            var extension = Path.GetExtension(fileName);
            var tempAudioPath = Path.ChangeExtension(tempFilePath, extension);

            try
            {
                // Copy stream to temporary file
                using (var fileStream = new FileStream(tempAudioPath, FileMode.Create))
                {
                    audioStream.Position = 0;
                    await audioStream.CopyToAsync(fileStream, cancellationToken);
                }

                // Extract metadata using FFMpeg
                var mediaInfo = await FFProbe.AnalyseAsync(tempAudioPath, cancellationToken: cancellationToken);

                var metadata = new MediaMetadata
                {
                    Duration = mediaInfo.Duration,
                    Format = mediaInfo.Format.FormatName,
                    Bitrate = (long)mediaInfo.Format.BitRate
                };

                var audioStreamInfo = mediaInfo.AudioStreams.FirstOrDefault();
                if (audioStreamInfo != null)
                {
                    metadata.SampleRate = audioStreamInfo.SampleRateHz;
                    metadata.Channels = audioStreamInfo.Channels;
                    metadata.Codec = audioStreamInfo.CodecName;
                }

                // Extract tags if available
                if (mediaInfo.Format.Tags != null)
                {
                    if (mediaInfo.Format.Tags.TryGetValue("title", out var title))
                        metadata.Title = title;
                    if (mediaInfo.Format.Tags.TryGetValue("artist", out var artist))
                        metadata.Artist = artist;
                    if (mediaInfo.Format.Tags.TryGetValue("album", out var album))
                        metadata.Album = album;
                    if (mediaInfo.Format.Tags.TryGetValue("date", out var year) && int.TryParse(year, out var yearInt))
                        metadata.Year = yearInt;
                }

                return metadata;
            }
            finally
            {
                // Clean up temporary files
                if (File.Exists(tempFilePath))
                    File.Delete(tempFilePath);
                if (File.Exists(tempAudioPath))
                    File.Delete(tempAudioPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting audio metadata: {FileName}", fileName);
            return new MediaMetadata();
        }
    }

    private bool ContainsDangerousPatterns(string fileName)
    {
        var dangerousPatterns = new[]
        {
            "..", "\\", "<", ">", ":", "\"", "|", "?", "*",
            "CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
            "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
        };

        var fileNameUpper = fileName.ToUpperInvariant();
        return dangerousPatterns.Any(pattern => fileNameUpper.Contains(pattern));
    }

    private async Task<bool> ValidateVideoFileHeaderAsync(Stream fileStream, string extension, CancellationToken cancellationToken)
    {
        try
        {
            fileStream.Position = 0;
            var buffer = new byte[12];
            await fileStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken);
            fileStream.Position = 0;

            return extension switch
            {
                ".mp4" => ValidateMp4Header(buffer),
                ".avi" => ValidateAviHeader(buffer),
                ".mov" => ValidateMovHeader(buffer),
                ".webm" => ValidateWebmHeader(buffer),
                _ => true // Allow other formats to pass basic validation
            };
        }
        catch
        {
            return false;
        }
    }

    private async Task<bool> ValidateAudioFileHeaderAsync(Stream fileStream, string extension, CancellationToken cancellationToken)
    {
        try
        {
            fileStream.Position = 0;
            var buffer = new byte[12];
            await fileStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken);
            fileStream.Position = 0;

            return extension switch
            {
                ".mp3" => ValidateMp3Header(buffer),
                ".wav" => ValidateWavHeader(buffer),
                ".aac" => ValidateAacHeader(buffer),
                ".flac" => ValidateFlacHeader(buffer),
                _ => true // Allow other formats to pass basic validation
            };
        }
        catch
        {
            return false;
        }
    }

    private async Task<bool> ValidateImageFileHeaderAsync(Stream fileStream, string extension, CancellationToken cancellationToken)
    {
        try
        {
            fileStream.Position = 0;
            var buffer = new byte[12];
            await fileStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken);
            fileStream.Position = 0;

            return extension switch
            {
                ".jpg" or ".jpeg" => ValidateJpegHeader(buffer),
                ".png" => ValidatePngHeader(buffer),
                ".webp" => ValidateWebpHeader(buffer),
                _ => true // Allow other formats to pass basic validation
            };
        }
        catch
        {
            return false;
        }
    }

    private bool ValidateMp4Header(byte[] buffer)
    {
        // MP4 files typically start with ftyp box
        return buffer.Length >= 8 && 
               buffer[4] == 0x66 && buffer[5] == 0x74 && buffer[6] == 0x79 && buffer[7] == 0x70;
    }

    private bool ValidateAviHeader(byte[] buffer)
    {
        // AVI files start with RIFF header
        return buffer.Length >= 12 &&
               buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
               buffer[8] == 0x41 && buffer[9] == 0x56 && buffer[10] == 0x49 && buffer[11] == 0x20;
    }

    private bool ValidateMovHeader(byte[] buffer)
    {
        // MOV files have similar structure to MP4
        return ValidateMp4Header(buffer);
    }

    private bool ValidateWebmHeader(byte[] buffer)
    {
        // WebM files start with EBML header
        return buffer.Length >= 4 &&
               buffer[0] == 0x1A && buffer[1] == 0x45 && buffer[2] == 0xDF && buffer[3] == 0xA3;
    }

    private bool ValidateMp3Header(byte[] buffer)
    {
        // MP3 files start with ID3 tag or sync frame
        return buffer.Length >= 3 &&
               ((buffer[0] == 0x49 && buffer[1] == 0x44 && buffer[2] == 0x33) || // ID3
                (buffer[0] == 0xFF && (buffer[1] & 0xE0) == 0xE0)); // Sync frame
    }

    private bool ValidateWavHeader(byte[] buffer)
    {
        // WAV files start with RIFF header
        return buffer.Length >= 12 &&
               buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
               buffer[8] == 0x57 && buffer[9] == 0x41 && buffer[10] == 0x56 && buffer[11] == 0x45;
    }

    private bool ValidateAacHeader(byte[] buffer)
    {
        // AAC files can have various headers, basic check for ADTS
        return buffer.Length >= 2 &&
               buffer[0] == 0xFF && (buffer[1] & 0xF0) == 0xF0;
    }

    private bool ValidateFlacHeader(byte[] buffer)
    {
        // FLAC files start with fLaC
        return buffer.Length >= 4 &&
               buffer[0] == 0x66 && buffer[1] == 0x4C && buffer[2] == 0x61 && buffer[3] == 0x43;
    }

    private bool ValidateJpegHeader(byte[] buffer)
    {
        // JPEG files start with FF D8
        return buffer.Length >= 2 &&
               buffer[0] == 0xFF && buffer[1] == 0xD8;
    }

    private bool ValidatePngHeader(byte[] buffer)
    {
        // PNG files have specific 8-byte signature
        return buffer.Length >= 8 &&
               buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47 &&
               buffer[4] == 0x0D && buffer[5] == 0x0A && buffer[6] == 0x1A && buffer[7] == 0x0A;
    }

    private bool ValidateWebpHeader(byte[] buffer)
    {
        // WebP files start with RIFF and contain WEBP
        return buffer.Length >= 12 &&
               buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
               buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50;
    }

    private async Task<VirusScanResult> PerformVirusScanAsync(Stream fileStream, CancellationToken cancellationToken)
    {
        // Placeholder for virus scanning implementation
        // In a real implementation, you would integrate with a virus scanning service
        // such as ClamAV, Windows Defender, or a cloud-based scanning service
        
        await Task.Delay(100, cancellationToken); // Simulate scan time
        
        return new VirusScanResult { IsClean = true };
    }

    private class VirusScanResult
    {
        public bool IsClean { get; set; }
        public string? ThreatName { get; set; }
    }
}