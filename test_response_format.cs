using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;

class Program
{
    static async Task Main(string[] args)
    {
        var factory = new WebApplicationFactory<WebAPI.Program>();
        var client = factory.CreateClient();

        try
        {
            var response = await client.GetAsync("/api/v7.0/media/discovery/search?searchTerm=test&pageSize=10");
            var content = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Status Code: {response.StatusCode}");
            Console.WriteLine($"Content Length: {content.Length}");
            Console.WriteLine("Response Content:");
            Console.WriteLine(content);
            
            if (content.Length > 0)
            {
                Console.WriteLine("\nFirst 500 characters:");
                Console.WriteLine(content.Substring(0, Math.Min(500, content.Length)));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}