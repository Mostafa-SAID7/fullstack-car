import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgentConfiguration } from '../components/AgentConfiguration';
import * as agentsService from '../../../services/ai-agent/agents';

// Mock the agents service
vi.mock('../../../services/ai-agent/agents');

const mockAgents = [
  { type: 'general', name: 'General Assistant', enabled: true },
  { type: 'mechanic', name: 'Mechanic Expert', enabled: true },
  { type: 'buyer_guide', name: 'Buyer\'s Guide', enabled: true },
  { type: 'seller_assistant', name: 'Seller\'s Assistant', enabled: true },
  { type: 'modification_expert', name: 'Modification Expert', enabled: true },
  { type: 'community_helper', name: 'Community Helper', enabled: true }
];

const mockAgentConfig = {
  personality: 'professional',
  expertise_level: 8,
  response_style: 'detailed',
  max_tokens: 500,
  temperature: 0.7
};

describe('AgentConfiguration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (agentsService.getAgents as any).mockResolvedValue(mockAgents);
    (agentsService.getAgentConfig as any).mockResolvedValue(mockAgentConfig);
    (agentsService.updateAgentConfig as any).mockResolvedValue({ success: true });
    (agentsService.testAgent as any).mockResolvedValue({
      response: 'Test response from agent',
      metadata: { tokens: 50, responseTime: 1.2 }
    });
  });

  it('renders agent selection dropdown', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('displays all 6 agents in dropdown', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.click(dropdown);
    });

    expect(screen.getByText('General Assistant')).toBeInTheDocument();
    expect(screen.getByText('Mechanic Expert')).toBeInTheDocument();
    expect(screen.getByText('Buyer\'s Guide')).toBeInTheDocument();
    expect(screen.getByText('Seller\'s Assistant')).toBeInTheDocument();
    expect(screen.getByText('Modification Expert')).toBeInTheDocument();
    expect(screen.getByText('Community Helper')).toBeInTheDocument();
  });

  it('loads agent configuration when agent is selected', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      expect(agentsService.getAgentConfig).toHaveBeenCalledWith('mechanic');
    });
  });

  it('displays configuration fields', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/personality/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expertise level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/response style/i)).toBeInTheDocument();
    });
  });

  it('updates configuration fields', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const personalityField = screen.getByLabelText(/personality/i);
      fireEvent.change(personalityField, { target: { value: 'friendly' } });
      expect(personalityField).toHaveValue('friendly');
    });
  });

  it('saves configuration when save button is clicked', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(agentsService.updateAgentConfig).toHaveBeenCalledWith('mechanic', expect.any(Object));
    });
  });

  it('validates configuration before saving', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const expertiseField = screen.getByLabelText(/expertise level/i);
      fireEvent.change(expertiseField, { target: { value: '15' } }); // Invalid: > 10
    });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/must be between 1 and 10/i)).toBeInTheDocument();
    });
  });

  it('tests agent with preview functionality', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const testButton = screen.getByRole('button', { name: /test agent/i });
      fireEvent.click(testButton);
    });

    await waitFor(() => {
      expect(agentsService.testAgent).toHaveBeenCalledWith('mechanic', expect.any(String));
      expect(screen.getByText('Test response from agent')).toBeInTheDocument();
    });
  });

  it('displays success message after saving', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/configuration saved successfully/i)).toBeInTheDocument();
    });
  });

  it('handles save errors gracefully', async () => {
    (agentsService.updateAgentConfig as any).mockRejectedValue(new Error('Failed to save'));
    
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });

  it('shows expertise level slider', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const slider = screen.getByRole('slider', { name: /expertise level/i });
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveValue('8');
    });
  });

  it('updates slider value', async () => {
    render(<AgentConfiguration />);
    
    await waitFor(() => {
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'mechanic' } });
    });

    await waitFor(() => {
      const slider = screen.getByRole('slider', { name: /expertise level/i });
      fireEvent.change(slider, { target: { value: '9' } });
      expect(slider).toHaveValue('9');
    });
  });
});
