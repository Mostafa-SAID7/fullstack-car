namespace Application.Common.Patterns.Observer
{
    public interface IObserver<in T>
    {
        Task HandleAsync(T notification, CancellationToken cancellationToken = default);
        int Priority { get; }
        bool CanHandle(T notification);
    }

    public interface ISubject<T>
    {
        void Subscribe(IObserver<T> observer);
        void Unsubscribe(IObserver<T> observer);
        Task NotifyAsync(T notification, CancellationToken cancellationToken = default);
    }

    public class Subject<T> : ISubject<T>
    {
        private readonly List<IObserver<T>> _observers = new();
        private readonly object _lock = new();

        public void Subscribe(IObserver<T> observer)
        {
            lock (_lock)
            {
                if (!_observers.Contains(observer))
                {
                    _observers.Add(observer);
                }
            }
        }

        public void Unsubscribe(IObserver<T> observer)
        {
            lock (_lock)
            {
                _observers.Remove(observer);
            }
        }

        public async Task NotifyAsync(T notification, CancellationToken cancellationToken = default)
        {
            List<IObserver<T>> observersToNotify;
            
            lock (_lock)
            {
                observersToNotify = _observers
                    .Where(o => o.CanHandle(notification))
                    .OrderByDescending(o => o.Priority)
                    .ToList();
            }

            var tasks = observersToNotify.Select(observer => 
                observer.HandleAsync(notification, cancellationToken));
            
            await Task.WhenAll(tasks);
        }
    }

    public abstract class BaseObserver<T> : IObserver<T>
    {
        public abstract Task HandleAsync(T notification, CancellationToken cancellationToken = default);
        public virtual bool CanHandle(T notification) => true;
        public virtual int Priority => 0;
    }

    public class DelegateObserver<T> : IObserver<T>
    {
        private readonly Func<T, CancellationToken, Task> _handler;
        private readonly Func<T, bool>? _canHandle;

        public DelegateObserver(
            Func<T, CancellationToken, Task> handler, 
            Func<T, bool>? canHandle = null, 
            int priority = 0)
        {
            _handler = handler;
            _canHandle = canHandle;
            Priority = priority;
        }

        public Task HandleAsync(T notification, CancellationToken cancellationToken = default)
        {
            return _handler(notification, cancellationToken);
        }

        public bool CanHandle(T notification)
        {
            return _canHandle?.Invoke(notification) ?? true;
        }

        public int Priority { get; }
    }

    public class ConditionalObserver<T> : IObserver<T>
    {
        private readonly IObserver<T> _innerObserver;
        private readonly Func<T, bool> _condition;

        public ConditionalObserver(IObserver<T> innerObserver, Func<T, bool> condition)
        {
            _innerObserver = innerObserver;
            _condition = condition;
        }

        public Task HandleAsync(T notification, CancellationToken cancellationToken = default)
        {
            return _innerObserver.HandleAsync(notification, cancellationToken);
        }

        public bool CanHandle(T notification)
        {
            return _condition(notification) && _innerObserver.CanHandle(notification);
        }

        public int Priority => _innerObserver.Priority;
    }

    public class ThrottledObserver<T> : IObserver<T>
    {
        private readonly IObserver<T> _innerObserver;
        private readonly TimeSpan _throttleInterval;
        private DateTime _lastExecution = DateTime.MinValue;
        private readonly object _lock = new();

        public ThrottledObserver(IObserver<T> innerObserver, TimeSpan throttleInterval)
        {
            _innerObserver = innerObserver;
            _throttleInterval = throttleInterval;
        }

        public Task HandleAsync(T notification, CancellationToken cancellationToken = default)
        {
            lock (_lock)
            {
                var now = DateTime.UtcNow;
                if (now - _lastExecution < _throttleInterval)
                {
                    return Task.CompletedTask;
                }
                _lastExecution = now;
            }

            return _innerObserver.HandleAsync(notification, cancellationToken);
        }

        public bool CanHandle(T notification)
        {
            return _innerObserver.CanHandle(notification);
        }

        public int Priority => _innerObserver.Priority;
    }
}