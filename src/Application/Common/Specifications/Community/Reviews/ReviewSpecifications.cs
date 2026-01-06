using Application.Common.Specifications;
using Domain.Entities.Community.Reviews;

namespace Application.Common.Specifications.Community.Reviews
{
    public class ReviewsWithDetailsSpecification : BaseSpecification<Review>
    {
        public ReviewsWithDetailsSpecification(int skip, int take, string? brand = null, string? model = null, Guid? userId = null) 
            : base(r => (userId == null || r.UserId == userId) && 
                        (brand == null || r.CarBrand == brand) && 
                        (model == null || r.CarModel == model) && !r.IsDeleted)
        {
            AddInclude(r => r.User);
            ApplyOrderByDescending(r => r.CreatedAt);
            ApplyPaging(skip, take);
        }
    }

    public class ReviewByIdSpecification : BaseSpecification<Review>
    {
        public ReviewByIdSpecification(Guid id) : base(r => r.Id == id && !r.IsDeleted)
        {
            AddInclude(r => r.User);
        }
    }
}
