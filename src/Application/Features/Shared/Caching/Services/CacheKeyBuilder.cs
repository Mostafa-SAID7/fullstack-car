using Application.Features.Shared.Caching.Interfaces.Services;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Application.Features.Shared.Caching.Services
{
    public class CacheKeyBuilder : ICacheKeyBuilder
    {
        private const string Separator = ":";
        private const string TagPrefix = "tag";
        private const string UserPrefix = "user";
        private const string RolePrefix = "role";

        public string BuildKey(string prefix, params object[] parameters)
        {
            if (string.IsNullOrEmpty(prefix))
                throw new ArgumentException("Prefix cannot be null or empty", nameof(prefix));

            var keyBuilder = new StringBuilder(prefix);

            if (parameters?.Length > 0)
            {
                foreach (var param in parameters)
                {
                    keyBuilder.Append(Separator);
                    keyBuilder.Append(param?.ToString() ?? "null");
                }
            }

            var key = keyBuilder.ToString();
            
            // If key is too long, hash it
            if (key.Length > 250)
            {
                return $"{prefix}{Separator}{ComputeHash(key)}";
            }

            return key;
        }

        public string BuildKey(Type type, params object[] parameters)
        {
            var prefix = type.Name.Replace("Query", "").Replace("Command", "").Replace("Request", "");
            return BuildKey(prefix, parameters);
        }

        public string BuildUserSpecificKey(string prefix, string userId, params object[] parameters)
        {
            var allParams = new object[] { UserPrefix, userId }.Concat(parameters).ToArray();
            return BuildKey(prefix, allParams);
        }

        public string BuildRoleSpecificKey(string prefix, string role, params object[] parameters)
        {
            var allParams = new object[] { RolePrefix, role }.Concat(parameters).ToArray();
            return BuildKey(prefix, allParams);
        }

        public string BuildTagKey(string tag)
        {
            return BuildKey(TagPrefix, tag);
        }

        public string BuildPatternKey(string pattern)
        {
            return pattern.Replace("*", "");
        }

        private static string ComputeHash(string input)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(hashBytes)[..16]; // Take first 16 characters
        }
    }
}