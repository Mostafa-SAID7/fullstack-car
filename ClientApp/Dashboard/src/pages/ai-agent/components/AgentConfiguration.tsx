// Agent Configuration Component - Configure individual agent settings

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Wrench,
  ShoppingCart,
  DollarSign,
  Settings,
  Users,
  Save,
  TestTube,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { agentManagementService } from '../../../services/ai-agent';
import { AgentType } from '../../../types/ai-agent';
import { AgentConfigForm } from './AgentConfigForm';
import { useToast } from '../../../hooks';

const AGENT_OPTIONS = [
  { value: AgentType.MECHANIC, label: 'Mechanic Agent', icon: Wrench, color: 'blue' },
  { value: AgentType.BUYER_GUIDE, label: "Buyer's Guide", icon: ShoppingCart, color: 'green' },
  { value: AgentType.SELLER_ASSISTANT, label: 'Seller Assistant', icon: DollarSign, color: 'purple' },
  { value: AgentType.MODIFICATION_EXPERT, label: 'Modification Expert', icon: Settings, color: 'orange' },
  { value: AgentType.COMMUNITY_HELPER, label: 'Community Helper', icon: Users, color: 'pink' },
  { value: AgentType.GENERAL, label: 'General Agent', icon: Bot, color: 'gray' }
];

export const AgentConfiguration: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(AgentType.GENERAL);
  const [config, setConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { success, error: toastError } = useToast();

  const selectedOption = AGENT_OPTIONS.find(opt => opt.value === selectedAgent);
  const Icon = selectedOption?.icon || Bot;

  const handleAgentChange = async (agentType: AgentType) => {
    setSelectedAgent(agentType);
    setTestResult(null);
    
    // Load agent configuration
    try {
      setLoading(true);
      const response = await agentManagementService.getAgentConfig(agentType);
      setConfig(response.config || {});
    } catch (error) {
      console.error('Error loading agent config:', error);
      toastError('Failed to load agent configuration');
      setConfig({});
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (updates: Record<string, any>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await agentManagementService.configureAgent(selectedAgent, config);
      success('Agent configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toastError('Failed to save agent configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      
      const response = await agentManagementService.testAgent(selectedAgent, {
        message: 'Hello, this is a test message. Can you help me?',
        userId: 'test-user'
      });

      setTestResult({
        success: true,
        message: response.text
      });
    } catch (error) {
      console.error('Error testing agent:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Configuration</h2>
          <p className="text-muted-foreground">Configure individual agent settings and behavior</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTest}
            disabled={testing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4" />
            )}
            Test Agent
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </div>
      </div>

      {/* Agent Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-3xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Select Agent</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {AGENT_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = selectedAgent === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleAgentChange(option.value)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? `border-${option.color}-500 bg-${option.color}-500/10`
                    : 'border-border hover:border-border/80 hover:bg-muted/30'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  isSelected
                    ? `bg-${option.color}-500/20`
                    : 'bg-muted'
                }`}>
                  <OptionIcon className={`w-6 h-6 ${
                    isSelected
                      ? `text-${option.color}-500`
                      : 'text-muted-foreground'
                  }`} />
                </div>
                <span className={`text-sm font-medium text-center ${
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Configuration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl bg-${selectedOption?.color}-500/10`}>
            <Icon className={`w-6 h-6 text-${selectedOption?.color}-500`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{selectedOption?.label} Configuration</h3>
            <p className="text-sm text-muted-foreground">Customize agent behavior and responses</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <AgentConfigForm
            agentType={selectedAgent}
            config={config}
            onChange={handleConfigChange}
          />
        )}
      </motion.div>

      {/* Test Result */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-card border rounded-3xl p-6 ${
            testResult.success
              ? 'border-green-500/50'
              : 'border-red-500/50'
          }`}
        >
          <div className="flex items-start gap-3">
            {testResult.success ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold mb-2">
                {testResult.success ? 'Test Successful' : 'Test Failed'}
              </h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {testResult.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
