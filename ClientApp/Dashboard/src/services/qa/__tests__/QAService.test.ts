import { qaService } from '../QAService';
import { reputationService } from '../ReputationService';

/**
 * Basic tests for QA services extending existing patterns
 * Tests service instantiation and basic method availability
 */
describe('QA Services Integration', () => {
  describe('QAService', () => {
    it('should be instantiated correctly', () => {
      expect(qaService).toBeDefined();
      expect(typeof qaService.getQuestions).toBe('function');
      expect(typeof qaService.createQuestion).toBe('function');
      expect(typeof qaService.getAnswersByQuestion).toBe('function');
      expect(typeof qaService.createVote).toBe('function');
    });

    it('should have all required question methods', () => {
      expect(typeof qaService.getQuestions).toBe('function');
      expect(typeof qaService.getQuestion).toBe('function');
      expect(typeof qaService.getQuestionDetail).toBe('function');
      expect(typeof qaService.createQuestion).toBe('function');
      expect(typeof qaService.updateQuestion).toBe('function');
      expect(typeof qaService.deleteQuestion).toBe('function');
      expect(typeof qaService.closeQuestion).toBe('function');
      expect(typeof qaService.searchQuestions).toBe('function');
      expect(typeof qaService.getSimilarQuestions).toBe('function');
    });

    it('should have all required answer methods', () => {
      expect(typeof qaService.getAnswersByQuestion).toBe('function');
      expect(typeof qaService.getAnswer).toBe('function');
      expect(typeof qaService.createAnswer).toBe('function');
      expect(typeof qaService.updateAnswer).toBe('function');
      expect(typeof qaService.deleteAnswer).toBe('function');
      expect(typeof qaService.acceptAnswer).toBe('function');
    });

    it('should have all required voting methods', () => {
      expect(typeof qaService.createVote).toBe('function');
      expect(typeof qaService.removeVote).toBe('function');
      expect(typeof qaService.changeVote).toBe('function');
      expect(typeof qaService.getUserVotes).toBe('function');
      expect(typeof qaService.getContentVotes).toBe('function');
    });

    it('should have moderation methods for dashboard', () => {
      expect(typeof qaService.bulkDeleteQuestions).toBe('function');
      expect(typeof qaService.bulkCloseQuestions).toBe('function');
      expect(typeof qaService.bulkDeleteAnswers).toBe('function');
      expect(typeof qaService.flagContent).toBe('function');
      expect(typeof qaService.adjustUserReputation).toBe('function');
      expect(typeof qaService.awardBadge).toBe('function');
    });

    it('should have analytics methods for dashboard', () => {
      expect(typeof qaService.getQAAnalytics).toBe('function');
      expect(typeof qaService.getFlaggedContent).toBe('function');
      expect(typeof qaService.getModerationActions).toBe('function');
      expect(typeof qaService.getUserModerationInfo).toBe('function');
    });
  });

  describe('ReputationService', () => {
    it('should be instantiated correctly', () => {
      expect(reputationService).toBeDefined();
      expect(typeof reputationService.getUserReputation).toBe('function');
      expect(typeof reputationService.getReputationLeaderboard).toBe('function');
      expect(typeof reputationService.getReputationHistory).toBe('function');
    });

    it('should have all required reputation methods', () => {
      expect(typeof reputationService.getUserReputation).toBe('function');
      expect(typeof reputationService.getReputationLeaderboard).toBe('function');
      expect(typeof reputationService.getReputationHistory).toBe('function');
      expect(typeof reputationService.adjustUserReputation).toBe('function');
      expect(typeof reputationService.awardBadge).toBe('function');
      expect(typeof reputationService.getExperts).toBe('function');
    });
  });

  describe('Service Integration', () => {
    it('should extend ApiService correctly', () => {
      // QAService should have inherited methods from ApiService
      expect(typeof (qaService as any).get).toBe('function');
      expect(typeof (qaService as any).post).toBe('function');
      expect(typeof (qaService as any).put).toBe('function');
      expect(typeof (qaService as any).delete).toBe('function');
    });

    it('should have error handling methods', () => {
      expect(typeof qaService.withErrorHandling).toBe('function');
      expect(typeof qaService.validateQuestionRequest).toBe('function');
      expect(typeof qaService.validateAnswerRequest).toBe('function');
    });

    it('should have filter builder methods', () => {
      expect(typeof qaService.buildQuestionFilter).toBe('function');
      expect(typeof qaService.buildSearchFilter).toBe('function');
    });
  });
});