using System.Linq.Expressions;
using Domain.Interfaces;

namespace Application.Common.Specifications
{
    public abstract class BaseSpecification<T> : ISpecification<T>
    {
        public Expression<Func<T, bool>>? Criteria { get; private set; }
        public List<Expression<Func<T, object>>> Includes { get; } = new();
        public List<string> IncludeStrings { get; } = new();
        public Expression<Func<T, object>>? OrderBy { get; private set; }
        public Expression<Func<T, object>>? OrderByDescending { get; private set; }
        public Expression<Func<T, object>>? GroupBy { get; private set; }
        public int Take { get; private set; }
        public int Skip { get; private set; }
        public bool IsPagingEnabled { get; private set; }

        protected BaseSpecification() { }

        protected BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        protected virtual void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }

        protected virtual void ApplyPaging(int skip, int take)
        {
            Skip = skip;
            Take = take;
            IsPagingEnabled = true;
        }

        protected virtual void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
        {
            OrderBy = orderByExpression;
        }

        protected virtual void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
        {
            OrderByDescending = orderByDescendingExpression;
        }

        protected virtual void ApplyGroupBy(Expression<Func<T, object>> groupByExpression)
        {
            GroupBy = groupByExpression;
        }

        public virtual bool IsSatisfiedBy(T entity)
        {
            return Criteria?.Compile()(entity) ?? true;
        }
    }

    public class AndSpecification<T> : BaseSpecification<T>
    {
        public AndSpecification(ISpecification<T> left, ISpecification<T> right)
            : base(CombineExpressions(left.Criteria, right.Criteria, Expression.AndAlso))
        {
        }

        private static Expression<Func<T, bool>> CombineExpressions(
            Expression<Func<T, bool>>? left,
            Expression<Func<T, bool>>? right,
            Func<Expression, Expression, BinaryExpression> combiner)
        {
            if (left == null || right == null)
                throw new ArgumentNullException("Specifications cannot be null");

            var parameter = Expression.Parameter(typeof(T));
            var leftVisitor = new ReplaceExpressionVisitor(left.Parameters[0], parameter);
            var rightVisitor = new ReplaceExpressionVisitor(right.Parameters[0], parameter);

            var leftBody = leftVisitor.Visit(left.Body);
            var rightBody = rightVisitor.Visit(right.Body);

            return Expression.Lambda<Func<T, bool>>(combiner(leftBody!, rightBody!), parameter);
        }
    }

    public class OrSpecification<T> : BaseSpecification<T>
    {
        public OrSpecification(ISpecification<T> left, ISpecification<T> right)
            : base(CombineExpressions(left.Criteria, right.Criteria, Expression.OrElse))
        {
        }

        private static Expression<Func<T, bool>> CombineExpressions(
            Expression<Func<T, bool>>? left,
            Expression<Func<T, bool>>? right,
            Func<Expression, Expression, BinaryExpression> combiner)
        {
            if (left == null || right == null)
                throw new ArgumentNullException("Specifications cannot be null");

            var parameter = Expression.Parameter(typeof(T));
            var leftVisitor = new ReplaceExpressionVisitor(left.Parameters[0], parameter);
            var rightVisitor = new ReplaceExpressionVisitor(right.Parameters[0], parameter);

            var leftBody = leftVisitor.Visit(left.Body);
            var rightBody = rightVisitor.Visit(right.Body);

            return Expression.Lambda<Func<T, bool>>(combiner(leftBody!, rightBody!), parameter);
        }
    }

    public class NotSpecification<T> : BaseSpecification<T>
    {
        public NotSpecification(ISpecification<T> specification)
            : base(specification.Criteria != null 
                ? Expression.Lambda<Func<T, bool>>(
                    Expression.Not(specification.Criteria.Body),
                    specification.Criteria.Parameters)
                : throw new ArgumentNullException(nameof(specification)))
        {
        }
    }

    internal class ReplaceExpressionVisitor : ExpressionVisitor
    {
        private readonly Expression _oldValue;
        private readonly Expression _newValue;

        public ReplaceExpressionVisitor(Expression oldValue, Expression newValue)
        {
            _oldValue = oldValue;
            _newValue = newValue;
        }

        public override Expression? Visit(Expression? node)
        {
            return node == _oldValue ? _newValue : base.Visit(node);
        }
    }

    public static class SpecificationExtensions
    {
        public static ISpecification<T> And<T>(this ISpecification<T> left, ISpecification<T> right)
        {
            return new AndSpecification<T>(left, right);
        }

        public static ISpecification<T> Or<T>(this ISpecification<T> left, ISpecification<T> right)
        {
            return new OrSpecification<T>(left, right);
        }

        public static ISpecification<T> Not<T>(this ISpecification<T> specification)
        {
            return new NotSpecification<T>(specification);
        }
    }
}