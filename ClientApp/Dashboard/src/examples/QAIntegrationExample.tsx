import React, { useEffect } from 'react';
import { QAProvider } from '../contexts/qa';
import { useAuth } from '../hooks/auth/useAuth';
import { 
  useQAQuestions, 
  useQASignalR, 
  useQAModeration 
} from '../hooks/qa';

/**
 * Example component demonstrating QA services integration
 * Shows how QA services extend existing React patterns
 * Integrates with existing authentication hooks and context
 */
const QADashboardExample: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    questions, 
    loading, 
    error, 
    loadQuestions, 
    createQuestion 
  } = useQAQuestions();
  
  const { 
    isConnected, 
    joinModeratorsGroup,
    subscribeToNewAnswers 
  } = useQASignalR();
  
  const { 
    canModerate,
    bulkDeleteQuestions,
    getQAAnalytics 
  } = useQAModeration();

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadQuestions({
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
    }
  }, [isAuthenticated, loadQuestions]);

  // Join moderators group if user can moderate
  useEffect(() => {
    if (isConnected && canModerate) {
      joinModeratorsGroup();
    }
  }, [isConnected, canModerate, joinModeratorsGroup]);

  // Subscribe to real-time events
  useEffect(() => {
    if (isConnected) {
      const unsubscribe = subscribeToNewAnswers((answerData) => {
        console.log('New answer received:', answerData);
        // Handle real-time answer updates
      });

      return unsubscribe;
    }
  }, [isConnected, subscribeToNewAnswers]);

  // Handle question creation
  const handleCreateQuestion = async () => {
    try {
      await createQuestion({
        title: 'Example Question from Dashboard',
        content: 'This is an example question created from the React Dashboard',
        category: 'Web Development',
        tags: ['react', 'dashboard', 'example']
      });
      console.log('Question created successfully');
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  // Handle bulk moderation
  const handleBulkDelete = async () => {
    if (canModerate && questions.length > 0) {
      try {
        const questionIds = questions.slice(0, 2).map(q => q.id);
        await bulkDeleteQuestions(questionIds);
        console.log('Bulk deletion completed');
      } catch (error) {
        console.error('Bulk deletion failed:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to access QA features</div>;
  }

  return (
    <div className="qa-dashboard-example">
      <h2>QA System Integration Example</h2>
      
      {/* User Info */}
      <div className="user-info">
        <p>User: {user?.name}</p>
        <p>Can Moderate: {canModerate ? 'Yes' : 'No'}</p>
        <p>SignalR Connected: {isConnected ? 'Yes' : 'No'}</p>
      </div>

      {/* Questions Section */}
      <div className="questions-section">
        <h3>Questions ({questions.length})</h3>
        
        {loading && <p>Loading questions...</p>}
        {error && <p className="error">Error: {error}</p>}
        
        <button onClick={handleCreateQuestion}>
          Create Example Question
        </button>
        
        {canModerate && (
          <button onClick={handleBulkDelete}>
            Bulk Delete (First 2 Questions)
          </button>
        )}
        
        <div className="questions-list">
          {questions.map(question => (
            <div key={question.id} className="question-item">
              <h4>{question.title}</h4>
              <p>Category: {question.category}</p>
              <p>Votes: {question.voteScore}</p>
              <p>Answers: {question.answerCount}</p>
              <p>By: {question.userName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Section (Admin only) */}
      {canModerate && (
        <div className="analytics-section">
          <h3>QA Analytics</h3>
          <button onClick={() => getQAAnalytics().then(console.log)}>
            Load Analytics
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Main example component with QA Provider
 * Demonstrates proper provider setup following existing patterns
 */
export const QAIntegrationExample: React.FC = () => {
  return (
    <QAProvider>
      <QADashboardExample />
    </QAProvider>
  );
};

export default QAIntegrationExample;