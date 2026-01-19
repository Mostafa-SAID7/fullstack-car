using Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Common.Behaviors
{
    public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

        public TransactionBehavior(IUnitOfWork unitOfWork, ILogger<TransactionBehavior<TRequest, TResponse>> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // Only wrap commands in a transaction, not queries
            if (typeof(TRequest).Name.EndsWith("Query"))
            {
                return await next();
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);
                _logger.LogInformation("Transaction started for {RequestName}", typeof(TRequest).Name);

                var response = await next();

                await _unitOfWork.CommitTransactionAsync(cancellationToken);
                _logger.LogInformation("Transaction committed for {RequestName}", typeof(TRequest).Name);

                return response;
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                _logger.LogError(ex, "Transaction rolled back for {RequestName} due to error: {Message}", 
                    typeof(TRequest).Name, ex.Message);
                throw;
            }
        }
    }
}
