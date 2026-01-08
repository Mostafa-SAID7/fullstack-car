using System.Text.Json.Serialization;

namespace Application.Common.Models
{
    public class Result
    {
        [JsonConstructor]
        internal Result(bool succeeded, IEnumerable<string> errors)
        {
            Succeeded = succeeded;
            Errors = errors.ToArray();
        }

        // Parameterless constructor for JSON deserialization
        public Result()
        {
            Succeeded = false;
            Errors = Array.Empty<string>();
        }

        public bool Succeeded { get; set; }
        public bool IsSuccess => Succeeded;
        public string[] Errors { get; set; } = Array.Empty<string>();
        public string? ErrorMessage => Errors?.FirstOrDefault();

        public static Result Success()
        {
            return new Result(true, Array.Empty<string>());
        }

        public static Result Failure(IEnumerable<string> errors)
        {
            return new Result(false, errors);
        }

        public static Result Failure(string error)
        {
            return new Result(false, new[] { error });
        }
    }

    public class Result<T> : Result
    {
        [JsonConstructor]
        internal Result(bool succeeded, T data, IEnumerable<string> errors) : base(succeeded, errors)
        {
            Data = data;
        }

        // Parameterless constructor for JSON deserialization
        public Result() : base()
        {
            Data = default!;
        }

        public T Data { get; set; } = default!;

        public static Result<T> Success(T data)
        {
            return new Result<T>(true, data, Array.Empty<string>());
        }

        public static new Result<T> Failure(IEnumerable<string> errors)
        {
            return new Result<T>(false, default!, errors);
        }

        public static new Result<T> Failure(string error)
        {
            return new Result<T>(false, default!, new[] { error });
        }
    }
}
