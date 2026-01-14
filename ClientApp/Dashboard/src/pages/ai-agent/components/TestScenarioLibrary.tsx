import React, { useState } from 'react';
import { Play, Trash2, Plus, Search, Calendar, MessageSquare } from 'lucide-react';
import type { TestScenario } from '../../../services/ai-agent/testing';

interface TestScenarioLibraryProps {
  scenarios: TestScenario[];
  onRunScenario: (scenarioId: string) => void;
  onDeleteScenario: (scenarioId: string) => void;
  onRefresh: () => void;
}

export const TestScenarioLibrary: React.FC<TestScenarioLibraryProps> = ({
  scenarios,
  onRunScenario,
  onDeleteScenario,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.testMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAgent = selectedAgent === 'all' || scenario.agentType === selectedAgent;

    return matchesSearch && matchesAgent;
  });

  const agentTypes = ['all', 'general', 'mechanic', 'buyer_guide', 'seller_assistant', 'modification_expert', 'community_helper'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Test Scenario Library</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Saved test scenarios for reusable testing
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scenarios..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {agentTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Agents' : type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Scenarios List */}
      {filteredScenarios.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery || selectedAgent !== 'all'
              ? 'No scenarios match your filters'
              : 'No test scenarios yet. Create one from the Quick Test tab.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-card-foreground mb-1">
                    {scenario.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRunScenario(scenario.id)}
                    className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors"
                    title="Run scenario"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteScenario(scenario.id)}
                    className="bg-destructive/10 text-destructive p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                    title="Delete scenario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-card-foreground">{scenario.testMessage}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="capitalize">{scenario.agentType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(scenario.createdAt).toLocaleDateString()}</span>
                </div>
                {scenario.expectedKeywords && scenario.expectedKeywords.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      {scenario.expectedKeywords.length} keyword{scenario.expectedKeywords.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
