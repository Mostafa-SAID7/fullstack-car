import React, { useState } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Clock, DollarSign, Zap, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ABTestResult } from '../../../services/ai-agent/testing';

interface ABTestComparisonProps {
  results: ABTestResult[];
  onRefresh: () => void;
}

export const ABTestComparison: React.FC<ABTestComparisonProps> = ({ results, onRefresh }) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  const getWinner = (result: ABTestResult): 'A' | 'B' | 'tie' => {
    const { comparison } = result;
    const scoreA =
      comparison.avgConfidenceA * 0.4 +
      (1 / comparison.avgResponseTimeA) * 1000 * 0.3 +
      (1 / comparison.avgCostA) * 0.3;
    const scoreB =
      comparison.avgConfidenceB * 0.4 +
      (1 / comparison.avgResponseTimeB) * 1000 * 0.3 +
      (1 / comparison.avgCostB) * 0.3;

    if (Math.abs(scoreA - scoreB) < 0.05) return 'tie';
    return scoreA > scoreB ? 'A' : 'B';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">A/B Test Results</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Compare different agent configurations side-by-side
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <GitCompare className="w-4 h-4" />
          New A/B Test
        </button>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <GitCompare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No A/B test results yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const winner = getWinner(result);
            const isExpanded = expandedResults.has(result.id);

            return (
              <div
                key={result.id}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-card-foreground mb-1">
                        {result.testName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(result.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpanded(result.id)}
                      className="bg-muted text-card-foreground p-2 rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Config A */}
                    <div
                      className={`bg-muted/50 rounded-xl p-4 ${
                        winner === 'A' ? 'ring-2 ring-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-card-foreground">Config A</h5>
                        {winner === 'A' && (
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <MetricRow
                          icon={<Zap className="w-4 h-4 text-blue-500" />}
                          label="Confidence"
                          value={`${(result.comparison.avgConfidenceA * 100).toFixed(1)}%`}
                        />
                        <MetricRow
                          icon={<Clock className="w-4 h-4 text-purple-500" />}
                          label="Response Time"
                          value={`${result.comparison.avgResponseTimeA.toFixed(0)}ms`}
                        />
                        <MetricRow
                          icon={<DollarSign className="w-4 h-4 text-green-500" />}
                          label="Cost"
                          value={`$${result.comparison.avgCostA.toFixed(4)}`}
                        />
                      </div>
                    </div>

                    {/* VS */}
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <GitCompare className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    {/* Config B */}
                    <div
                      className={`bg-muted/50 rounded-xl p-4 ${
                        winner === 'B' ? 'ring-2 ring-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-card-foreground">Config B</h5>
                        {winner === 'B' && (
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <MetricRow
                          icon={<Zap className="w-4 h-4 text-blue-500" />}
                          label="Confidence"
                          value={`${(result.comparison.avgConfidenceB * 100).toFixed(1)}%`}
                          comparison={
                            result.comparison.avgConfidenceB > result.comparison.avgConfidenceA
                              ? 'better'
                              : 'worse'
                          }
                        />
                        <MetricRow
                          icon={<Clock className="w-4 h-4 text-purple-500" />}
                          label="Response Time"
                          value={`${result.comparison.avgResponseTimeB.toFixed(0)}ms`}
                          comparison={
                            result.comparison.avgResponseTimeB < result.comparison.avgResponseTimeA
                              ? 'better'
                              : 'worse'
                          }
                        />
                        <MetricRow
                          icon={<DollarSign className="w-4 h-4 text-green-500" />}
                          label="Cost"
                          value={`$${result.comparison.avgCostB.toFixed(4)}`}
                          comparison={
                            result.comparison.avgCostB < result.comparison.avgCostA
                              ? 'better'
                              : 'worse'
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border p-6 bg-muted/20">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-semibold text-card-foreground mb-3">
                          Config A Results ({result.resultsA.length})
                        </h5>
                        <div className="space-y-2">
                          {result.resultsA.slice(0, 3).map((test, idx) => (
                            <div key={idx} className="bg-card rounded-lg p-3 text-xs">
                              <p className="text-muted-foreground mb-1">{test.testMessage}</p>
                              <p className="text-card-foreground line-clamp-2">{test.response}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-card-foreground mb-3">
                          Config B Results ({result.resultsB.length})
                        </h5>
                        <div className="space-y-2">
                          {result.resultsB.slice(0, 3).map((test, idx) => (
                            <div key={idx} className="bg-card rounded-lg p-3 text-xs">
                              <p className="text-muted-foreground mb-1">{test.testMessage}</p>
                              <p className="text-card-foreground line-clamp-2">{test.response}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface MetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  comparison?: 'better' | 'worse';
}

const MetricRow: React.FC<MetricRowProps> = ({ icon, label, value, comparison }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-card-foreground">{value}</span>
        {comparison && (
          <>
            {comparison === 'better' ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
          </>
        )}
      </div>
    </div>
  );
};
