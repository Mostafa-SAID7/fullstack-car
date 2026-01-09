using System.Net.Http;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

var factory = new WebApplicationFactory<Program>();
var client = factory.CreateClient();

var response = await client.GetAsync("/api/v7.0/media/discovery/search?searchTerm=test&pageSize=10");
var content = await response.Content.ReadAsStringAsync();

Console.WriteLine("Status Code: " + response.StatusCode);
Console.WriteLine("Response Content:");
Console.WriteLine(content);

// Try to parse and pretty print
try 
{
    var jsonDoc = JsonDocument.Parse(content);
    var prettyJson = JsonSerializer.Serialize(jsonDoc, new JsonSerializerOptions { WriteIndented = true });
    Console.WriteLine("\nPretty JSON:");
    Console.WriteLine(prettyJson);
}
catch (Exception ex)
{
    Console.WriteLine("Failed to parse JSON: " + ex.Message);
}