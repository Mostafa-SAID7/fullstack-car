using Microsoft.Extensions.DependencyInjection;

namespace Application.Common.Patterns.Factory
{
    public interface IFactory<out T>
    {
        T Create();
    }

    public interface IFactory<out T, in TParam>
    {
        T Create(TParam parameter);
    }

    public interface IFactory<out T, in TParam1, in TParam2>
    {
        T Create(TParam1 parameter1, TParam2 parameter2);
    }

    public interface IAsyncFactory<T>
    {
        Task<T> CreateAsync(CancellationToken cancellationToken = default);
    }

    public interface IAsyncFactory<T, in TParam>
    {
        Task<T> CreateAsync(TParam parameter, CancellationToken cancellationToken = default);
    }

    public abstract class AbstractFactory<T>
    {
        public abstract T Create();
        
        protected virtual void ValidateParameters()
        {
            // Override in derived classes for parameter validation
        }
    }

    public class ServiceFactory<T> : IFactory<T> where T : class
    {
        private readonly IServiceProvider _serviceProvider;

        public ServiceFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public T Create()
        {
            return _serviceProvider.GetRequiredService<T>();
        }
    }

    public class ParameterizedFactory<T, TParam> : IFactory<T, TParam>
    {
        private readonly Func<TParam, T> _factoryMethod;

        public ParameterizedFactory(Func<TParam, T> factoryMethod)
        {
            _factoryMethod = factoryMethod;
        }

        public T Create(TParam parameter)
        {
            return _factoryMethod(parameter);
        }
    }

    public class ConditionalFactory<T> : IFactory<T>
    {
        private readonly Dictionary<Func<bool>, Func<T>> _conditions;
        private readonly Func<T>? _defaultFactory;

        public ConditionalFactory(Dictionary<Func<bool>, Func<T>> conditions, Func<T>? defaultFactory = null)
        {
            _conditions = conditions;
            _defaultFactory = defaultFactory;
        }

        public T Create()
        {
            foreach (var condition in _conditions)
            {
                if (condition.Key())
                {
                    return condition.Value();
                }
            }

            if (_defaultFactory != null)
            {
                return _defaultFactory();
            }

            throw new InvalidOperationException("No matching condition found and no default factory provided");
        }
    }

    public class CachedFactory<T> : IFactory<T>
    {
        private readonly IFactory<T> _innerFactory;
        private readonly Lazy<T> _cachedInstance;

        public CachedFactory(IFactory<T> innerFactory)
        {
            _innerFactory = innerFactory;
            _cachedInstance = new Lazy<T>(_innerFactory.Create);
        }

        public T Create()
        {
            return _cachedInstance.Value;
        }
    }
}
