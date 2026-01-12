using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace WebAPI.IntegrationTests.Core;

/// <summary>
/// Extension methods for IServiceCollection to support integration testing
/// Provides utilities for service registration and configuration in test environments
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Removes all services of the specified type from the service collection
    /// </summary>
    /// <typeparam name="T">The service type to remove</typeparam>
    /// <param name="services">The service collection</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection RemoveAll<T>(this IServiceCollection services)
    {
        var servicesToRemove = services.Where(s => s.ServiceType == typeof(T)).ToList();
        foreach (var service in servicesToRemove)
        {
            services.Remove(service);
        }
        return services;
    }

    /// <summary>
    /// Removes all services that match the specified predicate
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <param name="predicate">The predicate to match services for removal</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection RemoveAll(this IServiceCollection services, Func<ServiceDescriptor, bool> predicate)
    {
        var servicesToRemove = services.Where(predicate).ToList();
        foreach (var service in servicesToRemove)
        {
            services.Remove(service);
        }
        return services;
    }

    /// <summary>
    /// Configures services for integration testing environment
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection ConfigureForIntegrationTesting(this IServiceCollection services)
    {
        // Remove services that might interfere with testing
        services.RemoveAll(s => s.ServiceType.Name.Contains("BackgroundService"));
        services.RemoveAll(s => s.ServiceType.Name.Contains("HostedService"));
        
        return services;
    }

    /// <summary>
    /// Gets the count of services registered for the specified type
    /// </summary>
    /// <typeparam name="T">The service type</typeparam>
    /// <param name="services">The service collection</param>
    /// <returns>The number of registered services</returns>
    public static int GetServiceCount<T>(this IServiceCollection services)
    {
        return services.Count(s => s.ServiceType == typeof(T));
    }

    /// <summary>
    /// Checks if a service type is registered
    /// </summary>
    /// <typeparam name="T">The service type</typeparam>
    /// <param name="services">The service collection</param>
    /// <returns>True if the service is registered, false otherwise</returns>
    public static bool IsRegistered<T>(this IServiceCollection services)
    {
        return services.Any(s => s.ServiceType == typeof(T));
    }

    /// <summary>
    /// Gets all service descriptors for the specified type
    /// </summary>
    /// <typeparam name="T">The service type</typeparam>
    /// <param name="services">The service collection</param>
    /// <returns>Collection of service descriptors</returns>
    public static IEnumerable<ServiceDescriptor> GetServices<T>(this IServiceCollection services)
    {
        return services.Where(s => s.ServiceType == typeof(T));
    }
}