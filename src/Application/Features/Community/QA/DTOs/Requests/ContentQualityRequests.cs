namespace Application.Features.Community.QA.DTOs.Requests;

public class ValidateContentRequest
{
    public string Content { get; set; } = string.Empty;
}

public class EvaluateQuestionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class EvaluateAnswerRequest
{
    public string Content { get; set; } = string.Empty;
}

public class DetailedAssessmentRequest
{
    public string Content { get; set; } = string.Empty;
    public string ContentType { get; set; } = "Answer";
}
