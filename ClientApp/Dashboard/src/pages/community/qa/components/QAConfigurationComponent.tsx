import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw,
  AlertTriangle,
  Info,
  Shield,
  Clock,
  Users,
  MessageSquare,
  Award,
  Flag,
  Bell,
  Globe,
  Lock
} from 'lucide-react';
import { Card } from '../layout/cards/Card';
import { Button } from '../forms/buttons/Button';
import { Input } from '../forms/inputs/Input';
import { Switch } from '../forms/switches/Switch';
import { TabNavigation } from '../shared/TabNavigation';
import { Alert } from '../feedback/alerts/Alert';
import { cn } from '../../lib/utils';

interface QAConfigurationComponentProps {
  className?: string;
}

interface QASettings {
  // General Settings
  allowAnonymousQuestions: boolean;
  requireEmailVerification: boolean;
  enableRealTimeUpdates: boolean;
  maxQuestionsPerDay: number;
  maxAnswersPerDay: number;
  
  // Content Settings
  minQuestionLength: number;
  maxQuestionLength: number;
  minAnswerLength: number;
  maxAnswerLength: number;
  allowMarkdown: boolean;
  allowCodeBlocks: boolean;
  maxTagsPerQuestion: number;
  
  // Moderation Settings
  enableAutoModeration: boolean;
  flagThreshold: number;
  autoCloseAfterDays: number;
  requireModerationApproval: boolean;
  spamDetectionEnabled: boolean;
  
  // Reputation Settings
  questionUpvotePoints: number;
  questionDownvotePoints: number;
  answerUpvotePoints: number;
  answerDownvotePoints: number;
  acceptedAnswerPoints: number;
  minReputationToVote: number;
  minReputationToComment: number;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyOnNewAnswers: boolean;
  notifyOnVotes: boolean;
  notifyOnAcceptedAnswers: boolean;
  
  // Expert Settings
  enableExpertSystem: boolean;
  expertBadgeThreshold: number;
  expertNotificationDelay: number;
  autoPromoteExperts: boolean;
}

export const QAConfigurationComponent: React.FC<QAConfigurationComponentProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<QASettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Mock initial settings
  const defaultSettings: QASettings = {
    // General Settings
    allowAnonymousQuestions: false,
    requireEmailVerification: true,
    enableRealTimeUpdates: true,
    maxQuestionsPerDay: 10,
    maxAnswersPerDay: 50,
    
    // Content Settings
    minQuestionLength: 30,
    maxQuestionLength: 5000,
    minAnswerLength: 20,
    maxAnswerLength: 10000,
    allowMarkdown: true,
    allowCodeBlocks: true,
    maxTagsPerQuestion: 5,
    
    // Moderation Settings
    enableAutoModeration: true,
    flagThreshold: 3,
    autoCloseAfterDays: 30,
    requireModerationApproval: false,
    spamDetectionEnabled: true,
    
    // Reputation Settings
    questionUpvotePoints: 5,
    questionDownvotePoints: -2,
    answerUpvotePoints: 10,
    answerDownvotePoints: -2,
    acceptedAnswerPoints: 15,
    minReputationToVote: 15,
    minReputationToComment: 50,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    notifyOnNewAnswers: true,
    notifyOnVotes: true,
    notifyOnAcceptedAnswers: true,
    
    // Expert Settings
    enableExpertSystem: true,
    expertBadgeThreshold: 1000,
    expertNotificationDelay: 24,
    autoPromoteExperts: true
  };

  useEffect(() => {
    // Simulate API call to load settings
    const loadSettings = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(defaultSettings);
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleSettingChange = (key: keyof QASettings, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving settings:', settings);
    setSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'content',
      label: 'Content',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      id: 'moderation',
      label: 'Moderation',
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'reputation',
      label: 'Reputation',
      icon: <Award className="w-4 h-4" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />
    },
    {
      id: 'experts',
      label: 'Experts',
      icon: <Users className="w-4 h-4" />
    }
  ];

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6" />
            QA System Configuration
          </h2>
          <p className="text-muted-foreground">Configure settings for your question and answer platform</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            loading={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <Alert variant="warning">
          <Info className="w-4 h-4" />
          <div>
            <p className="font-medium">Unsaved Changes</p>
            <p className="text-sm">You have unsaved configuration changes. Don't forget to save them.</p>
          </div>
        </Alert>
      )}

      {/* Configuration Tabs */}
      <Card className="p-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Access Control
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Allow Anonymous Questions</label>
                      <p className="text-sm text-muted-foreground">Allow users to ask questions without registration</p>
                    </div>
                    <Switch
                      checked={settings.allowAnonymousQuestions}
                      onCheckedChange={(checked) => handleSettingChange('allowAnonymousQuestions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Require Email Verification</label>
                      <p className="text-sm text-muted-foreground">Users must verify email before participating</p>
                    </div>
                    <Switch
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Real-time Updates</label>
                      <p className="text-sm text-muted-foreground">Enable live updates for new answers and votes</p>
                    </div>
                    <Switch
                      checked={settings.enableRealTimeUpdates}
                      onCheckedChange={(checked) => handleSettingChange('enableRealTimeUpdates', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Rate Limits
                  </h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Max Questions per Day</label>
                    <Input
                      type="number"
                      value={settings.maxQuestionsPerDay}
                      onChange={(e) => handleSettingChange('maxQuestionsPerDay', parseInt(e.target.value) || 0)}
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Max Answers per Day</label>
                    <Input
                      type="number"
                      value={settings.maxAnswersPerDay}
                      onChange={(e) => handleSettingChange('maxAnswersPerDay', parseInt(e.target.value) || 0)}
                      min="1"
                      max="200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Question Limits</h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Minimum Question Length</label>
                    <Input
                      type="number"
                      value={settings.minQuestionLength}
                      onChange={(e) => handleSettingChange('minQuestionLength', parseInt(e.target.value) || 0)}
                      min="10"
                      max="1000"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Characters required</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Maximum Question Length</label>
                    <Input
                      type="number"
                      value={settings.maxQuestionLength}
                      onChange={(e) => handleSettingChange('maxQuestionLength', parseInt(e.target.value) || 0)}
                      min="100"
                      max="50000"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Characters allowed</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Max Tags per Question</label>
                    <Input
                      type="number"
                      value={settings.maxTagsPerQuestion}
                      onChange={(e) => handleSettingChange('maxTagsPerQuestion', parseInt(e.target.value) || 0)}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Answer Limits</h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Minimum Answer Length</label>
                    <Input
                      type="number"
                      value={settings.minAnswerLength}
                      onChange={(e) => handleSettingChange('minAnswerLength', parseInt(e.target.value) || 0)}
                      min="5"
                      max="500"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Characters required</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Maximum Answer Length</label>
                    <Input
                      type="number"
                      value={settings.maxAnswerLength}
                      onChange={(e) => handleSettingChange('maxAnswerLength', parseInt(e.target.value) || 0)}
                      min="100"
                      max="100000"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Characters allowed</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Allow Markdown</label>
                        <p className="text-sm text-muted-foreground">Enable markdown formatting</p>
                      </div>
                      <Switch
                        checked={settings.allowMarkdown}
                        onCheckedChange={(checked) => handleSettingChange('allowMarkdown', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Allow Code Blocks</label>
                        <p className="text-sm text-muted-foreground">Enable syntax-highlighted code blocks</p>
                      </div>
                      <Switch
                        checked={settings.allowCodeBlocks}
                        onCheckedChange={(checked) => handleSettingChange('allowCodeBlocks', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Moderation Settings */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Auto Moderation
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Enable Auto Moderation</label>
                      <p className="text-sm text-muted-foreground">Automatically flag suspicious content</p>
                    </div>
                    <Switch
                      checked={settings.enableAutoModeration}
                      onCheckedChange={(checked) => handleSettingChange('enableAutoModeration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Spam Detection</label>
                      <p className="text-sm text-muted-foreground">Detect and flag spam content</p>
                    </div>
                    <Switch
                      checked={settings.spamDetectionEnabled}
                      onCheckedChange={(checked) => handleSettingChange('spamDetectionEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Require Approval</label>
                      <p className="text-sm text-muted-foreground">All content needs moderator approval</p>
                    </div>
                    <Switch
                      checked={settings.requireModerationApproval}
                      onCheckedChange={(checked) => handleSettingChange('requireModerationApproval', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Flag className="w-5 h-5" />
                    Thresholds
                  </h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Flag Threshold</label>
                    <Input
                      type="number"
                      value={settings.flagThreshold}
                      onChange={(e) => handleSettingChange('flagThreshold', parseInt(e.target.value) || 0)}
                      min="1"
                      max="10"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Number of flags before auto-hiding</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Auto-close After (Days)</label>
                    <Input
                      type="number"
                      value={settings.autoCloseAfterDays}
                      onChange={(e) => handleSettingChange('autoCloseAfterDays', parseInt(e.target.value) || 0)}
                      min="1"
                      max="365"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Days before auto-closing inactive questions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reputation Settings */}
          {activeTab === 'reputation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Point Values
                  </h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Question Upvote Points</label>
                    <Input
                      type="number"
                      value={settings.questionUpvotePoints}
                      onChange={(e) => handleSettingChange('questionUpvotePoints', parseInt(e.target.value) || 0)}
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Question Downvote Points</label>
                    <Input
                      type="number"
                      value={settings.questionDownvotePoints}
                      onChange={(e) => handleSettingChange('questionDownvotePoints', parseInt(e.target.value) || 0)}
                      max="-1"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Answer Upvote Points</label>
                    <Input
                      type="number"
                      value={settings.answerUpvotePoints}
                      onChange={(e) => handleSettingChange('answerUpvotePoints', parseInt(e.target.value) || 0)}
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Answer Downvote Points</label>
                    <Input
                      type="number"
                      value={settings.answerDownvotePoints}
                      onChange={(e) => handleSettingChange('answerDownvotePoints', parseInt(e.target.value) || 0)}
                      max="-1"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Accepted Answer Bonus</label>
                    <Input
                      type="number"
                      value={settings.acceptedAnswerPoints}
                      onChange={(e) => handleSettingChange('acceptedAnswerPoints', parseInt(e.target.value) || 0)}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Minimum Requirements
                  </h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Min Reputation to Vote</label>
                    <Input
                      type="number"
                      value={settings.minReputationToVote}
                      onChange={(e) => handleSettingChange('minReputationToVote', parseInt(e.target.value) || 0)}
                      min="0"
                      max="1000"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Min Reputation to Comment</label>
                    <Input
                      type="number"
                      value={settings.minReputationToComment}
                      onChange={(e) => handleSettingChange('minReputationToComment', parseInt(e.target.value) || 0)}
                      min="0"
                      max="1000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Types
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Push Notifications</label>
                      <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">New Answers</label>
                      <p className="text-sm text-muted-foreground">Notify when questions receive answers</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnNewAnswers}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnNewAnswers', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Votes</label>
                      <p className="text-sm text-muted-foreground">Notify when content receives votes</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnVotes}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnVotes', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Accepted Answers</label>
                      <p className="text-sm text-muted-foreground">Notify when answers are accepted</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnAcceptedAnswers}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnAcceptedAnswers', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expert Settings */}
          {activeTab === 'experts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Expert System
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Enable Expert System</label>
                      <p className="text-sm text-muted-foreground">Identify and promote expert users</p>
                    </div>
                    <Switch
                      checked={settings.enableExpertSystem}
                      onCheckedChange={(checked) => handleSettingChange('enableExpertSystem', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Auto-promote Experts</label>
                      <p className="text-sm text-muted-foreground">Automatically award expert badges</p>
                    </div>
                    <Switch
                      checked={settings.autoPromoteExperts}
                      onCheckedChange={(checked) => handleSettingChange('autoPromoteExperts', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expert Thresholds</h3>
                  
                  <div>
                    <label className="block font-medium mb-2">Expert Badge Threshold</label>
                    <Input
                      type="number"
                      value={settings.expertBadgeThreshold}
                      onChange={(e) => handleSettingChange('expertBadgeThreshold', parseInt(e.target.value) || 0)}
                      min="100"
                      max="10000"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Reputation required for expert badge</p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Expert Notification Delay (Hours)</label>
                    <Input
                      type="number"
                      value={settings.expertNotificationDelay}
                      onChange={(e) => handleSettingChange('expertNotificationDelay', parseInt(e.target.value) || 0)}
                      min="1"
                      max="168"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Hours to wait before notifying experts</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QAConfigurationComponent;