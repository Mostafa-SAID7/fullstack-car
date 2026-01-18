import React, { useState, useEffect } from 'react';
import { Play, Save, Trash2, Plus, GitCompare } from 'lucide-react';
import { testingService, type TestScenario, type TestResult, type ABTestResult } from '../../../services/ai-agent/testing';
import { TestMessageForm } from './TestMessageForm';
import { ResponsePreview } from './ResponsePreview';
import { TestScenarioLibrary } from './TestScenarioLibrary';
import { ABTestComparison } from './ABTestComparison';
import type { AgentType } from '../../../types/ai-agent';

type TabType = 'quick-test' | 'scenarios' | 'ab-test';

export const AgentTesting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('quick-test');
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('general');
  const [testMessage, setTestMessage] = useState('');
  const [context, setContext] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [abTestResults, setABTestResults] = useState<ABTestResult[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadScenarios();
    loadABTestResults();
  }, []);

  const loadScenarios = async () => {
    try {
      const data = await testingService.listScenarios();
      setScenarios(data);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  const loadABTestResults = async () => {
    try {
      const data = await testingService.getABTestResults(10);
      setABTestResults(data);
    } catch (error) {
      console.error('Failed to load A/B test results:', error);
    }
  };

  const handleQuickTest = async () => {
    if (!testMessage.trim()) return;

    setIsLoading(true);
    try {
      const result = await testingService.testAgent(selectedAgent, testMessage, context, images);
      setTestResult(result);
      setImages([]); // Clear images after test
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveScenario = async () => {
    if (!testMessage.trim()) return;

    try {
      const scenario = await testingService.createScenario({
        name: `Test ${scenarios.length + 1}`,
        description: testMessage.slice(0, 50) + '...',
        agentType: selectedAgent,
        testMessage,
        context,
        expectedKeywords: []
      });
      setScenarios([...scenarios, scenario]);
    } catch (error) {
      console.error('Failed to save scenario:', error);
    }
  };

  const handleRunScenario = async (scenarioId: string) => {
    setIsLoading(true);
    try {
      const result = await testingService.runScenario(scenarioId);
      setTestResult(result);
      setActiveTab('quick-test');
    } catch (error) {
      console.error('Failed to run scenario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    try {
      await testingService.deleteScenario(scenarioId);
      setScenarios(scenarios.filter(s => s.id !== scenarioId));
    } catch (error) {
      console.error('Failed to delete scenario:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Agent Testing</h2>
          <p className="text-muted-foreground mt-1">
            Test agent responses before deployment
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('quick-test')}
            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'quick-test'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
              }`}
          >
            Quick Test
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'scenarios'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
              }`}
          >
            Test Scenarios ({(scenarios || []).length})
          </button>
          <button
            onClick={() => setActiveTab('ab-test')}
            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'ab-test'
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
              }`}
          >
            A/B Testing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'quick-test' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Form */}
          <div className="space-y-4">
            <TestMessageForm
              selectedAgent={selectedAgent}
              testMessage={testMessage}
              context={context}
              images={images}
              onAgentChange={setSelectedAgent}
              onMessageChange={setTestMessage}
              onContextChange={setContext}
              onImagesChange={setImages}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleQuickTest}
                disabled={!testMessage.trim() || isLoading}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Run Test
              </button>
              <button
                onClick={handleSaveScenario}
                disabled={!testMessage.trim()}
                className="bg-card border border-border text-card-foreground px-4 py-2.5 rounded-xl font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {/* Response Preview */}
          <ResponsePreview testResult={testResult} isLoading={isLoading} />
        </div>
      )}

      {activeTab === 'scenarios' && (
        <TestScenarioLibrary
          scenarios={scenarios}
          onRunScenario={handleRunScenario}
          onDeleteScenario={handleDeleteScenario}
          onRefresh={loadScenarios}
        />
      )}

      {activeTab === 'ab-test' && (
        <ABTestComparison
          results={abTestResults}
          onRefresh={loadABTestResults}
        />
      )}
    </div>
  );
};
