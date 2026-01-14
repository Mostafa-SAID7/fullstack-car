import React from 'react';
import { MessageSquare, Clock, Zap, DollarSign, Cpu, CheckCircle, AlertCircle } from 'lucide-react';
import type { TestResult } from '../../../services/ai-agent/testing';

interface ResponsePreviewProps {
  testResult: TestResult | null;
  isLoading: boolean;
}

export const ResponsePreview: React.FC<ResponsePreviewProps> = ({ testResult, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Response Preview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Testing agent...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Response Preview</h3>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Run a test to see the response</p>
          </div>
        </div>
      </div>
    );
  }

  const confidence = testResult.metadata.confidence || 0;
  const confidenceColor =
    confidence >= 0.8 ? 'text-green-500' : confidence >= 0.6 ? 'text-yellow-500' : 'text-red-500';
  const confidenceBg =
    confidence >= 0.8 ? 'bg-green-500/10' : confidence >= 0.6 ? 'bg-yellow-500/10' : 'bg-red-500/10';

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Response Preview</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 ${confidenceBg} rounded-full`}>
          {confidence >= 0.7 ? (
            <CheckCircle className={`w-4 h-4 ${confidenceColor}`} />
          ) : (
            <AlertCircle className={`w-4 h-4 ${confidenceColor}`} />
          )}
          <span className={`text-sm font-medium ${confidenceColor}`}>
            {(confidence * 100).toFixed(0)}% Confidence
          </span>
        </div>
      </div>

      {/* Response Text */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-card-foreground mb-2">Agent Response</p>
            <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
              {testResult.response}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Processing Time</p>
              <p className="text-lg font-bold text-card-foreground">
                {testResult.metadata.processingTime || 0}ms
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tokens Used</p>
              <p className="text-lg font-bold text-card-foreground">
                {testResult.metadata.tokens || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estimated Cost</p>
              <p className="text-lg font-bold text-card-foreground">
                ${(testResult.metadata.cost || 0).toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="text-sm font-bold text-card-foreground truncate">
                {testResult.metadata.model || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Agent Type</p>
            <p className="text-sm font-semibold text-card-foreground capitalize">
              {testResult.agentType.replace('_', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Test ID</p>
            <p className="text-xs font-mono text-card-foreground">{testResult.id.slice(0, 8)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
