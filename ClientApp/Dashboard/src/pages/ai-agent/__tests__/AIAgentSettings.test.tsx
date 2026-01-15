import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIAgentSettings } from '../components/AIAgentSettings';

const mockConfig = {
  isEnabled: true,
  autoLearning: true,
  debugMode: false,
  llmProvider: 'openai' as const,
  apiKey: 'sk-test-key-123',
  maxTokens: 500,
  temperature: 0.7,
  topP: 1.0,
  topK: 50,
  rateLimit: 100,
  cacheTTL: 3600,
  costLimit: 100,
  notifyOnError: true,
  notifyOnFeedback: false,
  apiEndpoint: 'https://api.openai.com/v1',
  timeout: 30000,
  advanced: {}
};

describe('AIAgentSettings Component', () => {
  let mockOnConfigUpdate: jest.Mock;

  beforeEach(() => {
    mockOnConfigUpdate = jest.fn();
  });

  it('renders settings header', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    expect(screen.getByText('AI Agent Settings')).toBeInTheDocument();
    expect(screen.getByText(/configure global AI agent behavior/i)).toBeInTheDocument();
  });

  it('displays all section tabs', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('LLM Provider')).toBeInTheDocument();
    expect(screen.getByText(/API & Rate Limiting/i)).toBeInTheDocument();
    expect(screen.getByText('Caching')).toBeInTheDocument();
    expect(screen.getByText('Cost Limits')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('shows general settings by default', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByText('Enable AI Agent')).toBeInTheDocument();
    expect(screen.getByText('Auto-Learning')).toBeInTheDocument();
    expect(screen.getByText('Debug Mode')).toBeInTheDocument();
  });

  it('toggles AI agent enabled setting', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const toggle = screen.getByText('Enable AI Agent').parentElement?.querySelector('button');
    fireEvent.click(toggle!);
    
    expect(mockOnConfigUpdate).toHaveBeenCalledWith({ isEnabled: false });
  });

  it('toggles auto-learning setting', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const toggle = screen.getByText('Auto-Learning').parentElement?.querySelector('button');
    fireEvent.click(toggle!);
    
    expect(mockOnConfigUpdate).toHaveBeenCalledWith({ autoLearning: false });
  });

  it('toggles debug mode setting', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const toggle = screen.getByText('Debug Mode').parentElement?.querySelector('button');
    fireEvent.click(toggle!);
    
    expect(mockOnConfigUpdate).toHaveBeenCalledWith({ debugMode: true });
  });

  it('switches to LLM Provider section', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const llmTab = screen.getByText('LLM Provider');
    fireEvent.click(llmTab);
    
    expect(screen.getByText(/LLM Provider Settings/i)).toBeInTheDocument();
  });

  it('switches to API section', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const apiTab = screen.getByText(/API & Rate Limiting/i);
    fireEvent.click(apiTab);
    
    expect(screen.getByText(/API Settings/i)).toBeInTheDocument();
  });

  it('switches to Caching section', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const cacheTab = screen.getByText('Caching');
    fireEvent.click(cacheTab);
    
    expect(screen.getByText(/Cache Settings/i)).toBeInTheDocument();
  });

  it('switches to Cost Limits section', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const costTab = screen.getByText('Cost Limits');
    fireEvent.click(costTab);
    
    expect(screen.getByText(/Cost Limit Settings/i)).toBeInTheDocument();
  });

  it('switches to Notifications section', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const notifTab = screen.getByText('Notifications');
    fireEvent.click(notifTab);
    
    expect(screen.getByText(/Notification Settings/i)).toBeInTheDocument();
  });

  it('displays save button', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('calls save when save button clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Saving settings:', mockConfig);
  });

  it('shows toggle in correct state for enabled setting', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const toggle = screen.getByText('Enable AI Agent').parentElement?.querySelector('button');
    expect(toggle).toHaveClass('bg-primary');
  });

  it('shows toggle in correct state for disabled setting', () => {
    const disabledConfig = { ...mockConfig, debugMode: false };
    render(<AIAgentSettings config={disabledConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const toggle = screen.getByText('Debug Mode').parentElement?.querySelector('button');
    expect(toggle).toHaveClass('bg-muted');
  });

  it('displays setting descriptions', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    expect(screen.getByText(/Turn the AI agent on or off globally/i)).toBeInTheDocument();
    expect(screen.getByText(/Automatically improve responses/i)).toBeInTheDocument();
    expect(screen.getByText(/Enable detailed logging/i)).toBeInTheDocument();
  });

  it('renders all section icons', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const tabs = screen.getAllByRole('button');
    expect(tabs.length).toBeGreaterThan(6); // At least 6 section tabs + save button
  });

  it('highlights active section', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const generalTab = screen.getByText('General');
    expect(generalTab).toHaveClass('bg-primary');
  });

  it('updates active section highlight when clicked', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const llmTab = screen.getByText('LLM Provider');
    fireEvent.click(llmTab);
    
    expect(llmTab).toHaveClass('bg-primary');
  });

  it('persists config changes', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const toggle = screen.getByText('Enable AI Agent').parentElement?.querySelector('button');
    fireEvent.click(toggle!);
    
    expect(mockOnConfigUpdate).toHaveBeenCalledTimes(1);
  });

  it('handles multiple toggle changes', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const enableToggle = screen.getByText('Enable AI Agent').parentElement?.querySelector('button');
    const learningToggle = screen.getByText('Auto-Learning').parentElement?.querySelector('button');
    const debugToggle = screen.getByText('Debug Mode').parentElement?.querySelector('button');
    
    fireEvent.click(enableToggle!);
    fireEvent.click(learningToggle!);
    fireEvent.click(debugToggle!);
    
    expect(mockOnConfigUpdate).toHaveBeenCalledTimes(3);
  });

  it('displays correct initial values', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const enableToggle = screen.getByText('Enable AI Agent').parentElement?.querySelector('button');
    const learningToggle = screen.getByText('Auto-Learning').parentElement?.querySelector('button');
    const debugToggle = screen.getByText('Debug Mode').parentElement?.querySelector('button');
    
    expect(enableToggle).toHaveClass('bg-primary'); // enabled
    expect(learningToggle).toHaveClass('bg-primary'); // enabled
    expect(debugToggle).toHaveClass('bg-muted'); // disabled
  });

  it('renders with disabled config', () => {
    const disabledConfig = {
      ...mockConfig,
      isEnabled: false,
      autoLearning: false,
      debugMode: false
    };
    
    render(<AIAgentSettings config={disabledConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const enableToggle = screen.getByText('Enable AI Agent').parentElement?.querySelector('button');
    const learningToggle = screen.getByText('Auto-Learning').parentElement?.querySelector('button');
    const debugToggle = screen.getByText('Debug Mode').parentElement?.querySelector('button');
    
    expect(enableToggle).toHaveClass('bg-muted');
    expect(learningToggle).toHaveClass('bg-muted');
    expect(debugToggle).toHaveClass('bg-muted');
  });

  it('allows navigation between all sections', () => {
    render(<AIAgentSettings config={mockConfig} onConfigUpdate={mockOnConfigUpdate} />);
    
    const sections = ['LLM Provider', 'Caching', 'Cost Limits', 'Notifications', 'General'];
    
    sections.forEach(section => {
      const tab = screen.getByText(section);
      fireEvent.click(tab);
      expect(tab).toHaveClass('bg-primary');
    });
  });
});
