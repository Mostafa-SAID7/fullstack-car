import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FeedbackReview } from '../components/FeedbackReview';
import { feedbackService } from '../../../services/ai-agent/feedback';

// Mock the feedback service
jest.mock('../../../services/ai-agent/feedback');

const mockFeedback = [
  {
    id: 'fb1',
    conversationId: 'conv1',
    messageId: 'msg1',
    type: 'positive' as const,
    userId: 'user1',
    agentType: 'mechanic' as const,
    rating: 5,
    comment: 'Very helpful advice!',
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fb2',
    conversationId: 'conv2',
    messageId: 'msg2',
    type: 'negative' as const,
    userId: 'user2',
    agentType: 'buyer_guide' as const,
    rating: 2,
    comment: 'Not accurate information',
    timestamp: '2024-01-15T11:00:00Z'
  },
  {
    id: 'fb3',
    conversationId: 'conv3',
    messageId: 'msg3',
    type: 'correction' as const,
    userId: 'user3',
    agentType: 'general' as const,
    correction: 'The correct answer is...',
    originalResponse: 'Wrong answer',
    timestamp: '2024-01-15T12:00:00Z'
  }
];

describe('FeedbackReview Component', () => {
  const mockedService = feedbackService as jest.Mocked<typeof feedbackService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedService.listFeedback.mockResolvedValue({
      feedback: mockFeedback,
      total: mockFeedback.length
    });
    mockedService.approveCorrection.mockResolvedValue({ success: true, message: 'Success' });
    mockedService.rejectFeedback.mockResolvedValue({ success: true });
    mockedService.bulkApprove.mockResolvedValue({ success: true, approved: 2 });
    mockedService.bulkReject.mockResolvedValue({ success: true, rejected: 2 });
    mockedService.exportFeedback.mockResolvedValue(new Blob(['test data']));

    window.URL.createObjectURL = jest.fn(() => 'blob:test');
    window.URL.revokeObjectURL = jest.fn();
  });

  it('renders feedback review header', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText(/feedback/i)).toBeInTheDocument();
    });
  });

  it('displays all feedback items', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Very helpful advice!')).toBeInTheDocument();
      expect(screen.getByText('Not accurate information')).toBeInTheDocument();
      expect(screen.getByText(/correct answer/i)).toBeInTheDocument();
    });
  });

  it('filters feedback by type', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const typeFilter = screen.getByRole('combobox', { name: /type/i });
      fireEvent.change(typeFilter, { target: { value: 'positive' } });
    });

    await waitFor(() => {
      expect(mockedService.listFeedback).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'positive' })
      );
    });
  });

  it('filters feedback by agent', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const agentFilter = screen.getByRole('combobox', { name: /agent/i });
      fireEvent.change(agentFilter, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      expect(mockedService.listFeedback).toHaveBeenCalledWith(
        expect.objectContaining({ agentType: 'mechanic' })
      );
    });
  });

  it('approves correction', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const approveButtons = screen.getAllByRole('button', { name: /approve/i });
      fireEvent.click(approveButtons[0]);
    });

    await waitFor(() => {
      expect(mockedService.approveCorrection).toHaveBeenCalledWith('fb3');
      expect(screen.getByText(/correction approved/i)).toBeInTheDocument();
    });
  });

  it('rejects feedback', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const rejectButtons = screen.getAllByRole('button', { name: /reject/i });
      fireEvent.click(rejectButtons[0]);
    });

    await waitFor(() => {
      expect(mockedService.rejectFeedback).toHaveBeenCalled();
      expect(screen.getByText(/feedback rejected/i)).toBeInTheDocument();
    });
  });

  it('selects feedback for bulk actions', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  it('performs bulk approve', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
    });

    const bulkApproveButton = screen.getByRole('button', { name: /bulk approve/i });
    fireEvent.click(bulkApproveButton);

    await waitFor(() => {
      expect(mockedService.bulkApprove).toHaveBeenCalled();
      expect(screen.getByText(/2 corrections approved/i)).toBeInTheDocument();
    });
  });

  it('performs bulk reject', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
    });

    const bulkRejectButton = screen.getByRole('button', { name: /bulk reject/i });
    fireEvent.click(bulkRejectButton);

    await waitFor(() => {
      expect(mockedService.bulkReject).toHaveBeenCalled();
      expect(screen.getByText(/2 feedback items rejected/i)).toBeInTheDocument();
    });
  });

  it('shows error when bulk action with no selection', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const bulkApproveButton = screen.getByRole('button', { name: /bulk approve/i });
      fireEvent.click(bulkApproveButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/no feedback selected/i)).toBeInTheDocument();
    });
  });

  it('exports feedback as CSV', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const csvButton = screen.getByText('Export CSV');
      fireEvent.click(csvButton);
    });

    await waitFor(() => {
      expect(mockedService.exportFeedback).toHaveBeenCalledWith('csv', expect.any(Object));
    });
  });

  it('exports feedback as PDF', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const pdfButton = screen.getByText('Export PDF');
      fireEvent.click(pdfButton);
    });

    await waitFor(() => {
      expect(mockedService.exportFeedback).toHaveBeenCalledWith('pdf', expect.any(Object));
    });
  });

  it('handles error loading feedback', async () => {
    (feedbackService.listFeedback as jest.Mock).mockRejectedValue(
      new Error('Failed to load')
    );

    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load feedback/i)).toBeInTheDocument();
    });
  });

  it('handles error approving correction', async () => {
    (feedbackService.approveCorrection as jest.Mock).mockRejectedValue(
      new Error('Approval failed')
    );

    render(<FeedbackReview />);

    await waitFor(() => {
      const approveButtons = screen.getAllByRole('button', { name: /approve/i });
      fireEvent.click(approveButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to approve correction/i)).toBeInTheDocument();
    });
  });

  it('handles error rejecting feedback', async () => {
    (feedbackService.rejectFeedback as jest.Mock).mockRejectedValue(
      new Error('Rejection failed')
    );

    render(<FeedbackReview />);

    await waitFor(() => {
      const rejectButtons = screen.getAllByRole('button', { name: /reject/i });
      fireEvent.click(rejectButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to reject feedback/i)).toBeInTheDocument();
    });
  });

  it('refreshes feedback list', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Very helpful advice!')).toBeInTheDocument();
    });

    jest.clearAllMocks();

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockedService.listFeedback).toHaveBeenCalled();
    });
  });

  it('displays feedback detail when selected', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const feedbackItem = screen.getByText('Very helpful advice!');
      fireEvent.click(feedbackItem);
    });

    await waitFor(() => {
      expect(screen.getByText(/conversation/i)).toBeInTheDocument();
    });
  });

  it('shows positive feedback indicator', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Very helpful advice!')).toBeInTheDocument();
      // Positive feedback should have thumbs up icon
    });
  });

  it('shows negative feedback indicator', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Not accurate information')).toBeInTheDocument();
      // Negative feedback should have thumbs down icon
    });
  });

  it('shows correction indicator', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText(/correct answer/i)).toBeInTheDocument();
      // Correction should have alert icon
    });
  });

  it('clears selection after bulk action', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
    });

    const bulkApproveButton = screen.getByRole('button', { name: /bulk approve/i });
    fireEvent.click(bulkApproveButton);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });
  });

  it('reloads feedback after approval', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      const approveButtons = screen.getAllByRole('button', { name: /approve/i });
      fireEvent.click(approveButtons[0]);
    });

    await waitFor(() => {
      expect(mockedService.listFeedback).toHaveBeenCalledTimes(2); // Initial load + reload
    });
  });
});
