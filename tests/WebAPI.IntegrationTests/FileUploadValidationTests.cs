using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Text;
using Application.Common.Interfaces;
using Application.Common.Models;

namespace WebAPI.IntegrationTests;

public class FileUploadValidationTests : BaseIntegrationTest
{
    public FileUploadValidationTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task FileValidationService_ValidateVideoFile_WithValidMp4_ShouldReturnValid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        // Create a minimal valid MP4 file header
        var mp4Header = new byte[] 
        { 
            0x00, 0x00, 0x00, 0x20, // Box size
            0x66, 0x74, 0x79, 0x70, // 'ftyp' box type
            0x69, 0x73, 0x6F, 0x6D, // Brand 'isom'
            0x00, 0x00, 0x02, 0x00, // Minor version
            0x69, 0x73, 0x6F, 0x6D, // Compatible brand 'isom'
            0x69, 0x73, 0x6F, 0x32, // Compatible brand 'iso2'
            0x61, 0x76, 0x63, 0x31, // Compatible brand 'avc1'
            0x6D, 0x70, 0x34, 0x31  // Compatible brand 'mp41'
        };
        
        using var stream = new MemoryStream(mp4Header);
        
        // Act
        var result = await validationService.ValidateVideoFileAsync(
            stream, 
            "test.mp4", 
            "video/mp4", 
            mp4Header.Length);
        
        // Assert
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public async Task FileValidationService_ValidateVideoFile_WithInvalidExtension_ShouldReturnInvalid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        var data = Encoding.UTF8.GetBytes("This is not a video file");
        using var stream = new MemoryStream(data);
        
        // Act
        var result = await validationService.ValidateVideoFileAsync(
            stream, 
            "test.txt", 
            "text/plain", 
            data.Length);
        
        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.Contains("extension"));
    }

    [Fact]
    public async Task FileValidationService_ValidateVideoFile_WithExcessiveSize_ShouldReturnInvalid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        var data = new byte[100];
        using var stream = new MemoryStream(data);
        
        // Act - Simulate a file larger than 2GB
        var result = await validationService.ValidateVideoFileAsync(
            stream, 
            "test.mp4", 
            "video/mp4", 
            3_000_000_000L); // 3GB
        
        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.Contains("size") && e.Contains("exceeds"));
    }

    [Fact]
    public async Task FileValidationService_ValidateAudioFile_WithValidMp3_ShouldReturnValid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        // Create a minimal valid MP3 file header (ID3 tag)
        var mp3Header = new byte[] 
        { 
            0x49, 0x44, 0x33, // ID3
            0x03, 0x00,       // Version 2.3
            0x00,             // Flags
            0x00, 0x00, 0x00, 0x00 // Size
        };
        
        using var stream = new MemoryStream(mp3Header);
        
        // Act
        var result = await validationService.ValidateAudioFileAsync(
            stream, 
            "test.mp3", 
            "audio/mpeg", 
            mp3Header.Length);
        
        // Assert
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public async Task FileValidationService_ValidateAudioFile_WithInvalidMimeType_ShouldReturnInvalid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        var data = Encoding.UTF8.GetBytes("This is not an audio file");
        using var stream = new MemoryStream(data);
        
        // Act
        var result = await validationService.ValidateAudioFileAsync(
            stream, 
            "test.mp3", 
            "application/octet-stream", 
            data.Length);
        
        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.Contains("MIME type"));
    }

    [Fact]
    public async Task FileValidationService_ValidateImageFile_WithValidJpeg_ShouldReturnValid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        // Create a minimal valid JPEG file header
        var jpegHeader = new byte[] 
        { 
            0xFF, 0xD8, // JPEG SOI marker
            0xFF, 0xE0, // JFIF marker
            0x00, 0x10, // Length
            0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
            0x01, 0x01, // Version
            0x01,       // Units
            0x00, 0x48, // X density
            0x00, 0x48, // Y density
            0x00, 0x00  // Thumbnail
        };
        
        using var stream = new MemoryStream(jpegHeader);
        
        // Act
        var result = await validationService.ValidateImageFileAsync(
            stream, 
            "test.jpg", 
            "image/jpeg", 
            jpegHeader.Length);
        
        // Assert
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public async Task FileValidationService_ValidateFile_WithDangerousFileName_ShouldReturnInvalid()
    {
        // Arrange
        using var scope = Factory.Services.CreateScope();
        var validationService = scope.ServiceProvider.GetRequiredService<IFileValidationService>();
        
        var data = new byte[100];
        using var stream = new MemoryStream(data);
        
        // Act
        var result = await validationService.ValidateVideoFileAsync(
            stream, 
            "../../../dangerous.mp4", 
            "video/mp4", 
            data.Length);
        
        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.Contains("dangerous"));
    }
}