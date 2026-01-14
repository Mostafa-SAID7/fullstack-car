// QA Hooks - Main Export (composed from sub-modules)
// Following existing auth hooks pattern

export { useQA } from '../../contexts/qa';
export { useQAQuestions } from './useQAQuestions';
export { useQAAnswers } from './useQAAnswers';
export { useQAVoting } from './useQAVoting';
export { useQAReputation } from './useQAReputation';
export { useQASearch } from './useQASearch';
export { useQASignalR } from './useQASignalR';
export { useQAModeration } from './useQAModeration';

// Re-export SignalR connection hooks
export { 
  useQASignalRConnection,
  useQAAnswerEvents,
  useQAVoteEvents,
  useQAReputationEvents,
  useQAModerationEvents
} from '../useQASignalRConnection';