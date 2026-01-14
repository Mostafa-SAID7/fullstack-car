// Agent Config Form Component - Form fields for agent configuration

import { motion } from 'framer-motion';
import { AgentType } from '../../../types/ai-agent';

interface AgentConfigFormProps {
  agentType: AgentType;
  config: Record<string, any>;
  onChange: (updates: Record<string, any>) => void;
}

export const AgentConfigForm: React.FC<AgentConfigFormProps> = ({
  agentType,
  config,
  onChange
}) => {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value });
  };

  // Common configuration fields for all agents
  const renderCommonFields = () => (
    <>
      {/* Temperature */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Temperature
          </label>
          <span className="text-sm text-muted-foreground">
            {config.temperature || 0.7}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.temperature || 0.7}
          onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          Controls randomness: 0 is focused, 1 is creative
        </p>
      </motion.div>

      {/* Max Tokens */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <label className="text-sm font-semibold text-foreground">
          Max Response Length (tokens)
        </label>
        <input
          type="number"
          min="50"
          max="2000"
          step="50"
          value={config.max_tokens || 500}
          onChange={(e) => handleChange('max_tokens', parseInt(e.target.value))}
          className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <p className="text-xs text-muted-foreground">
          Maximum length of agent responses
        </p>
      </motion.div>

      {/* Response Style */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <label className="text-sm font-semibold text-foreground">
          Response Style
        </label>
        <select
          value={config.response_style || 'balanced'}
          onChange={(e) => handleChange('response_style', e.target.value)}
          className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
        >
          <option value="concise">Concise - Short and direct</option>
          <option value="balanced">Balanced - Moderate detail</option>
          <option value="detailed">Detailed - Comprehensive explanations</option>
          <option value="friendly">Friendly - Conversational tone</option>
          <option value="professional">Professional - Formal tone</option>
        </select>
      </motion.div>

      {/* Confidence Threshold */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Confidence Threshold
          </label>
          <span className="text-sm text-muted-foreground">
            {((config.confidence_threshold || 0.7) * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={config.confidence_threshold || 0.7}
          onChange={(e) => handleChange('confidence_threshold', parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          Minimum confidence to provide an answer
        </p>
      </motion.div>
    </>
  );

  // Agent-specific configuration fields
  const renderAgentSpecificFields = () => {
    switch (agentType) {
      case AgentType.MECHANIC:
        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-foreground">
                Expertise Level
              </label>
              <select
                value={config.expertise_level || 'intermediate'}
                onChange={(e) => handleChange('expertise_level', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option value="beginner">Beginner - Simple explanations</option>
                <option value="intermediate">Intermediate - Balanced technical detail</option>
                <option value="expert">Expert - Advanced technical language</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="text-sm font-semibold">Include Diagnostic Steps</p>
                <p className="text-xs text-muted-foreground">Provide step-by-step troubleshooting</p>
              </div>
              <button
                onClick={() => handleChange('include_diagnostic_steps', !config.include_diagnostic_steps)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.include_diagnostic_steps ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.include_diagnostic_steps ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </motion.div>
          </>
        );

      case AgentType.BUYER_GUIDE:
        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-foreground">
                Price Range Sensitivity
              </label>
              <select
                value={config.price_sensitivity || 'medium'}
                onChange={(e) => handleChange('price_sensitivity', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option value="low">Low - Focus on features over price</option>
                <option value="medium">Medium - Balance price and features</option>
                <option value="high">High - Prioritize budget-friendly options</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="text-sm font-semibold">Show Comparison Tables</p>
                <p className="text-xs text-muted-foreground">Include vehicle comparisons</p>
              </div>
              <button
                onClick={() => handleChange('show_comparisons', !config.show_comparisons)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.show_comparisons ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.show_comparisons ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </motion.div>
          </>
        );

      case AgentType.SELLER_ASSISTANT:
        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-foreground">
                Pricing Strategy
              </label>
              <select
                value={config.pricing_strategy || 'market_based'}
                onChange={(e) => handleChange('pricing_strategy', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option value="competitive">Competitive - Below market average</option>
                <option value="market_based">Market Based - At market average</option>
                <option value="premium">Premium - Above market average</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="text-sm font-semibold">Auto-Generate Descriptions</p>
                <p className="text-xs text-muted-foreground">Create listing descriptions automatically</p>
              </div>
              <button
                onClick={() => handleChange('auto_generate_descriptions', !config.auto_generate_descriptions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.auto_generate_descriptions ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.auto_generate_descriptions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </motion.div>
          </>
        );

      case AgentType.MODIFICATION_EXPERT:
        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-foreground">
                Safety Priority
              </label>
              <select
                value={config.safety_priority || 'high'}
                onChange={(e) => handleChange('safety_priority', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option value="low">Low - Performance focused</option>
                <option value="medium">Medium - Balanced approach</option>
                <option value="high">High - Safety first</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="text-sm font-semibold">Check Compatibility</p>
                <p className="text-xs text-muted-foreground">Verify part compatibility automatically</p>
              </div>
              <button
                onClick={() => handleChange('check_compatibility', !config.check_compatibility)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.check_compatibility ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.check_compatibility ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </motion.div>
          </>
        );

      case AgentType.COMMUNITY_HELPER:
        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-foreground">
                Help Style
              </label>
              <select
                value={config.help_style || 'step_by_step'}
                onChange={(e) => handleChange('help_style', e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option value="quick_tips">Quick Tips - Brief guidance</option>
                <option value="step_by_step">Step by Step - Detailed instructions</option>
                <option value="video_tutorials">Video Tutorials - Visual learning</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="text-sm font-semibold">Suggest Related Content</p>
                <p className="text-xs text-muted-foreground">Recommend related posts and groups</p>
              </div>
              <button
                onClick={() => handleChange('suggest_related', !config.suggest_related)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.suggest_related ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.suggest_related ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </motion.div>
          </>
        );

      case AgentType.GENERAL:
      default:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
          >
            <div>
              <p className="text-sm font-semibold">Suggest Specialized Agents</p>
              <p className="text-xs text-muted-foreground">Recommend switching to specialized agents</p>
            </div>
            <button
              onClick={() => handleChange('suggest_specialists', !config.suggest_specialists)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.suggest_specialists ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.suggest_specialists ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Common Fields */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          General Settings
        </h4>
        {renderCommonFields()}
      </div>

      {/* Agent-Specific Fields */}
      <div className="space-y-6 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Agent-Specific Settings
        </h4>
        {renderAgentSpecificFields()}
      </div>
    </div>
  );
};
