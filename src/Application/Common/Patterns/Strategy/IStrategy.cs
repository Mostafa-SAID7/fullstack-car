namespace Application.Common.Patterns.Strategy
{
    public interface IStrategy<in TInput, out TOutput>
    {
        TOutput Execute(TInput input);
        bool CanHandle(TInput input);
        int Priority { get; }
    }

    public interface IAsyncStrategy<in TInput, TOutput>
    {
        Task<TOutput> ExecuteAsync(TInput input, CancellationToken cancellationToken = default);
        bool CanHandle(TInput input);
        int Priority { get; }
    }

    public interface IStrategyContext<TInput, TOutput>
    {
        TOutput ExecuteStrategy(TInput input);
        void RegisterStrategy(IStrategy<TInput, TOutput> strategy);
        void UnregisterStrategy(IStrategy<TInput, TOutput> strategy);
        List<IStrategy<TInput, TOutput>> GetAvailableStrategies(TInput input);
    }

    public class StrategyContext<TInput, TOutput> : IStrategyContext<TInput, TOutput>
    {
        private readonly List<IStrategy<TInput, TOutput>> _strategies = new();

        public TOutput ExecuteStrategy(TInput input)
        {
            var strategy = _strategies
                .Where(s => s.CanHandle(input))
                .OrderByDescending(s => s.Priority)
                .FirstOrDefault();

            if (strategy == null)
            {
                throw new InvalidOperationException($"No strategy found for input type {typeof(TInput).Name}");
            }

            return strategy.Execute(input);
        }

        public void RegisterStrategy(IStrategy<TInput, TOutput> strategy)
        {
            _strategies.Add(strategy);
        }

        public void UnregisterStrategy(IStrategy<TInput, TOutput> strategy)
        {
            _strategies.Remove(strategy);
        }

        public List<IStrategy<TInput, TOutput>> GetAvailableStrategies(TInput input)
        {
            return _strategies
                .Where(s => s.CanHandle(input))
                .OrderByDescending(s => s.Priority)
                .ToList();
        }
    }

    public class AsyncStrategyContext<TInput, TOutput> : IAsyncStrategy<TInput, TOutput>
    {
        private readonly List<IAsyncStrategy<TInput, TOutput>> _strategies = new();

        public async Task<TOutput> ExecuteAsync(TInput input, CancellationToken cancellationToken = default)
        {
            var strategy = _strategies
                .Where(s => s.CanHandle(input))
                .OrderByDescending(s => s.Priority)
                .FirstOrDefault();

            if (strategy == null)
            {
                throw new InvalidOperationException($"No strategy found for input type {typeof(TInput).Name}");
            }

            return await strategy.ExecuteAsync(input, cancellationToken);
        }

        public bool CanHandle(TInput input)
        {
            return _strategies.Any(s => s.CanHandle(input));
        }

        public int Priority => _strategies.Max(s => s.Priority);

        public void RegisterStrategy(IAsyncStrategy<TInput, TOutput> strategy)
        {
            _strategies.Add(strategy);
        }

        public void UnregisterStrategy(IAsyncStrategy<TInput, TOutput> strategy)
        {
            _strategies.Remove(strategy);
        }

        public List<IAsyncStrategy<TInput, TOutput>> GetAvailableStrategies(TInput input)
        {
            return _strategies
                .Where(s => s.CanHandle(input))
                .OrderByDescending(s => s.Priority)
                .ToList();
        }
    }

    public abstract class BaseStrategy<TInput, TOutput> : IStrategy<TInput, TOutput>
    {
        public abstract TOutput Execute(TInput input);
        public abstract bool CanHandle(TInput input);
        public virtual int Priority => 0;

        protected virtual void ValidateInput(TInput input)
        {
            if (input == null)
                throw new ArgumentNullException(nameof(input));
        }
    }

    public abstract class BaseAsyncStrategy<TInput, TOutput> : IAsyncStrategy<TInput, TOutput>
    {
        public abstract Task<TOutput> ExecuteAsync(TInput input, CancellationToken cancellationToken = default);
        public abstract bool CanHandle(TInput input);
        public virtual int Priority => 0;

        protected virtual void ValidateInput(TInput input)
        {
            if (input == null)
                throw new ArgumentNullException(nameof(input));
        }
    }
}
