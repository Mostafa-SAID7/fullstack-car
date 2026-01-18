namespace Application.Common.Models
{
    public class PaginatedResult<T>
    {
        public List<T> Items { get; }
        public int PageNumber { get; }
        public int PageSize { get; }
        public int TotalPages { get; }
        public int TotalCount { get; }
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;

        public PaginatedResult(List<T> items, int count, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            TotalCount = count;
            Items = items;
        }

        public static PaginatedResult<T> Create(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = source.Count();
            var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            return new PaginatedResult<T>(items, count, pageNumber, pageSize);
        }

        public static async Task<PaginatedResult<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await Task.FromResult(source.Count());
            var items = await Task.FromResult(source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList());
            return new PaginatedResult<T>(items, count, pageNumber, pageSize);
        }
    }
}