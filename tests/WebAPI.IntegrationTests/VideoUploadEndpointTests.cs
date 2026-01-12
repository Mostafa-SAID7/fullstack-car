using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace WebAPI.IntegrationTests;

public class VideoUploadEndpointTests : BaseIntegrationTest
{
    public VideoUploadEndpointTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task VideoUpload_WithInvalidFile_ShouldReturnBadRequest()
    {
        // Arrange
        var content = new MultipartFormDataContent();
        
        // Add a text file instead of video
        var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes("This is not a video file"));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/plain");
        content.Add(fileContent, "file", "test.txt");
        
        // Add form data
        content.Add(new StringContent("Test Video"), "Title");
        content.Add(new StringContent("Test Description"), "Description");
        content.Add(new StringContent("HD"), "Quality");
        content.Add(new StringContent("true"), "IsPublic");
        content.Add(new StringContent("true"), "AllowComments");

        // Act
        var response = await Client.PostAsync("/api/v7.0/media/videos/upload", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains("validation failed", responseContent.ToLower());
    }

    [Fact]
    public async Task VideoUpload_WithExcessiveFileSize_ShouldReturnBadRequest()
    {
        // Arrange
        var content = new MultipartFormDataContent();
        
        // Create a small file but claim it's 3GB
        var fileContent = new ByteArrayContent(new byte[1000]);
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("video/mp4");
        fileContent.Headers.ContentLength = 3_000_000_000L; // 3GB
        content.Add(fileContent, "file", "test.mp4");
        
        // Add form data
        content.Add(new StringContent("Test Video"), "Title");
        content.Add(new StringContent("Test Description"), "Description");
        content.Add(new StringContent("HD"), "Quality");
        content.Add(new StringContent("true"), "IsPublic");
        content.Add(new StringContent("true"), "AllowComments");

        // Act
        var response = await Client.PostAsync("/api/v7.0/media/videos/upload", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains("validation failed", responseContent.ToLower());
    }
}