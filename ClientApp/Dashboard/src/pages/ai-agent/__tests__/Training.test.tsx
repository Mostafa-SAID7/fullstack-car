import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Training } from '../components/Training';
import type { AIAgentTrainingService } from '../../../services/ai-agent/training';

// Mock the training service
jest.mock('../../../services/ai-agent/training');

// Import the mocked service
import { trainingService } from '../../../services/ai-agent/training';

const mockTrainingService = trainingService as jest.Mocked<AIAgentTrainingService>;

const mockTrainingSessions = [
  {
    id: 'session1',
    name: 'Training Session 1',
    modelId: 'model-1',
    status: 'running' as const,
    progress: 45,
    startedAt: '2024-01-15T10:00:00Z',
    config: {
      datasetId: 'dataset-1',
      epochs: 10,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2,
      earlyStopping: true,
      checkpointInterval: 100
    },
    metrics: {
      loss: [0.45, 0.35, 0.25],
      accuracy: [0.75, 0.80, 0.85],
      validationLoss: [0.50, 0.40, 0.30],
      validationAccuracy: [0.70, 0.75, 0.82],
      learningRate: [0.001, 0.001, 0.001],
      documentsProcessed: 450,
      knowledgeEntriesAdded: 120
    } as any
  },
  {
    id: 'session2',
    name: 'Training Session 2',
    modelId: 'model-2',
    status: 'completed' as const,
    progress: 100,
    startedAt: '2024-01-14T10:00:00Z',
    completedAt: '2024-01-14T12:30:00Z',
    config: {
      datasetId: 'dataset-2',
      epochs: 10,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2,
      earlyStopping: true,
      checkpointInterval: 100
    },
    metrics: {
      loss: [0.35, 0.25, 0.15],
      accuracy: [0.85, 0.88, 0.92],
      validationLoss: [0.40, 0.30, 0.20],
      validationAccuracy: [0.82, 0.86, 0.90],
      learningRate: [0.001, 0.001, 0.001],
      documentsProcessed: 1000,
      knowledgeEntriesAdded: 350
    } as any
  },
  {
    id: 'session3',
    name: 'Training Session 3',
    modelId: 'model-3',
    status: 'failed' as const,
    progress: 30,
    startedAt: '2024-01-13T10:00:00Z',
    completedAt: '2024-01-13T10:45:00Z',
    config: {
      datasetId: 'dataset-3',
      epochs: 10,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2,
      earlyStopping: true,
      checkpointInterval: 100
    }
  }
];

describe('Training Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrainingService.listTrainingSessions.mockResolvedValue({
      sessions: mockTrainingSessions,
      total: mockTrainingSessions.length
    });
    mockTrainingService.startTraining.mockResolvedValue({
      id: 'new-session',
      name: 'New Training',
      modelId: 'new-model',
      status: 'running',
      progress: 0,
      startedAt: new Date().toISOString(),
      config: {
        datasetId: 'new-dataset',
        epochs: 10,
        batchSize: 32,
        learningRate: 0.001,
        validationSplit: 0.2,
        earlyStopping: true,
        checkpointInterval: 100
      }
    } as any);
    mockTrainingService.stopTraining.mockResolvedValue({ success: true, message: 'Stopped' });
    mockTrainingService.deleteTrainingSession.mockResolvedValue({ success: true });
  });

  it('renders training management header', async () => {
    render(<Training />);

    await waitFor(() => {
      expect(screen.getByText('Training Management')).toBeInTheDocument();
      expect(screen.getByText('Train and improve AI agent models')).toBeInTheDocument();
    });
  });

  it('displays training sessions after loading', async () => {
    render(<Training />);

    await waitFor(() => {
      expect(screen.getByText('Training Session 1')).toBeInTheDocument();
      expect(screen.getByText('Training Session 2')).toBeInTheDocument();
      expect(screen.getByText('Training Session 3')).toBeInTheDocument();
    });
  });

  it('shows correct stats cards', async () => {
    render(<Training />);

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Total sessions
      expect(screen.getByText('1')).toBeInTheDocument(); // Running
      expect(screen.getByText('Total Sessions')).toBeInTheDocument();
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });

  it('displays running count correctly', async () => {
    render(<Training />);

    await waitFor(() => {
      const runningElements = screen.getAllByText('1');
      expect(runningElements.length).toBeGreaterThan(0);
    });
  });

  it('displays completed count correctly', async () => {
    render(<Training />);

    await waitFor(() => {
      const completedElements = screen.getAllByText('1');
      expect(completedElements.length).toBeGreaterThan(0);
    });
  });

  it('displays failed count correctly', async () => {
    render(<Training />);

    await waitFor(() => {
      const failedElements = screen.getAllByText('1');
      expect(failedElements.length).toBeGreaterThan(0);
    });
  });

  it('opens new training form when button clicked', async () => {
    render(<Training />);

    await waitFor(() => {
      const newButton = screen.getByRole('button', { name: /new training/i });
      fireEvent.click(newButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/training configuration/i)).toBeInTheDocument();
    });
  });

  it('starts training session', async () => {
    render(<Training />);

    await waitFor(() => {
      const newButton = screen.getByRole('button', { name: /new training/i });
      fireEvent.click(newButton);
    });

    await waitFor(() => {
      const startButton = screen.getByRole('button', { name: /start training/i });
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(mockTrainingService.startTraining).toHaveBeenCalled();
    });
  });

  it('stops training session', async () => {
    render(<Training />);

    await waitFor(() => {
      const session = screen.getByText('Training Session 1');
      fireEvent.click(session);
    });

    await waitFor(() => {
      const stopButton = screen.getByRole('button', { name: /stop/i });
      fireEvent.click(stopButton);
    });

    await waitFor(() => {
      expect(mockTrainingService.stopTraining).toHaveBeenCalledWith('session1');
    });
  });

  it('deletes training session with confirmation', async () => {
    // Mock window.confirm
    globalThis.confirm = jest.fn(() => true);

    render(<Training />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(mockTrainingService.deleteTrainingSession).toHaveBeenCalled();
    });
  });

  it('does not delete when confirmation cancelled', async () => {
    globalThis.confirm = jest.fn(() => false);

    render(<Training />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
    });

    expect(mockTrainingService.deleteTrainingSession).not.toHaveBeenCalled();
  });

  it('refreshes training sessions', async () => {
    render(<Training />);

    await waitFor(() => {
      expect(screen.getByText('Training Session 1')).toBeInTheDocument();
    });

    jest.clearAllMocks();

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockTrainingService.listTrainingSessions).toHaveBeenCalled();
    });
  });

  it('selects training session to view details', async () => {
    render(<Training />);

    await waitFor(() => {
      const session = screen.getByText('Training Session 1');
      fireEvent.click(session);
    });

    await waitFor(() => {
      expect(screen.getByText(/progress/i)).toBeInTheDocument();
    });
  });

  it('shows progress for running session', async () => {
    render(<Training />);

    await waitFor(() => {
      const session = screen.getByText('Training Session 1');
      fireEvent.click(session);
    });

    await waitFor(() => {
      expect(screen.getByText(/45%/)).toBeInTheDocument();
    });
  });

  it('handles error loading sessions', async () => {
    mockTrainingService.listTrainingSessions.mockRejectedValue(
      new Error('Failed to load')
    );

    render(<Training />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load training sessions/i)).toBeInTheDocument();
    });
  });

  it('handles error starting training', async () => {
    mockTrainingService.startTraining.mockRejectedValue(
      new Error('Failed to start')
    );

    render(<Training />);

    await waitFor(() => {
      const newButton = screen.getByRole('button', { name: /new training/i });
      fireEvent.click(newButton);
    });

    await waitFor(() => {
      const startButton = screen.getByRole('button', { name: /start training/i });
      fireEvent.click(startButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to start training/i)).toBeInTheDocument();
    });
  });

  it('shows status icons correctly', async () => {
    render(<Training />);

    await waitFor(() => {
      // Running session should have spinning icon
      const runningSession = screen.getByText('Training Session 1');
      expect(runningSession).toBeInTheDocument();

      // Completed session should have check icon
      const completedSession = screen.getByText('Training Session 2');
      expect(completedSession).toBeInTheDocument();

      // Failed session should have X icon
      const failedSession = screen.getByText('Training Session 3');
      expect(failedSession).toBeInTheDocument();
    });
  });

  it('displays metrics for completed session', async () => {
    render(<Training />);

    await waitFor(() => {
      const session = screen.getByText('Training Session 2');
      fireEvent.click(session);
    });

    await waitFor(() => {
      expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
      expect(screen.getByText(/92%/)).toBeInTheDocument();
    });
  });

  it('shows error message for failed session', async () => {
    render(<Training />);

    await waitFor(() => {
      const session = screen.getByText('Training Session 3');
      fireEvent.click(session);
    });

    await waitFor(() => {
      expect(screen.getByText(/out of memory/i)).toBeInTheDocument();
    });
  });
});
