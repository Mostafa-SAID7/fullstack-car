namespace Infrastructure.Common
{
    public class CacheSettings
    {
        public bool Enabled { get; set; } = true;
        public string RedisConnectionString { get; set; } = string.Empty;
        public int DefaultExpirationMinutes { get; set; } = 60;
        public bool UseRedis { get; set; } = false;
    }
}
