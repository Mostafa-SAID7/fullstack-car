namespace Domain.Enums.Community
{
    public enum ReputationChangeReason
    {
        // Positive Changes
        AnswerUpvoted = 1,
        QuestionUpvoted = 2,
        AnswerAccepted = 3,
        BestAnswerBonus = 4,
        ExpertBonus = 5,
        
        // Negative Changes
        AnswerDownvoted = -1,
        QuestionDownvoted = -2,
        ContentRemoved = -3,
        SpamPenalty = -4,
        ModerationPenalty = -5,
        
        // Neutral/Administrative
        ManualAdjustment = 0,
        SystemCorrection = 100
    }
}
