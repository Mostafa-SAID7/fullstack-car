import React, { useState, useEffect } from 'react';
import {
  Settings,
  BarChart3,
  Activity,
  Search,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Save,
  TestTube,
  Eye
} from 'lucide-react';
import type { AnalyticsSettings as AnalyticsSettingsType } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';

interface SettingSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description,
  icon,
  children
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export const AnalyticsSettings: React.FC = () => {
  const [settings, setSettings] = useState<AnalyticsSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingGA, setTestingGA] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalyticsSettings();
      setSettings(data);
    } catch (err) {
      toastError('Failed to load analytics settings');
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await analyticsService.updateAnalyticsSettings(settings);
      success('Analytics settings saved successfully!');
    } catch (err) {
      toastError('Failed to save analytics settings');
    } finally {
      setSaving(false);
    }
  };

  const testGoogleAnalytics = async () => {
    if (!settings?.googleAnalytics.trackingId) {
      toastError('Please enter a Google Analytics tracking ID first');
      return;
    }

    try {
      setTestingGA(true);
      const result = await analyticsService.testGoogleAnalyticsConnection(settings.googleAnalytics.trackingId);

      if (result.connected) {
        success(`Google Analytics connected! Last data: ${result.lastData || 'No data yet'}`);
      } else {
        toastError(result.error || 'Failed to connect to Google Analytics');
      }
    } catch (err) {
      toastError('Failed to test Google Analytics connection');
    } finally {
      setTestingGA(false);
    }
  };


  const updateGoogleAnalytics = (updates: Partial<AnalyticsSettingsType['googleAnalytics']>) => {
    setSettings(prev => prev ? {
      ...prev,
      googleAnalytics: { ...prev.googleAnalytics, ...updates }
    } : null);
  };

  const updatePerformanceMonitoring = (updates: Partial<AnalyticsSettingsType['performanceMonitoring']>) => {
    setSettings(prev => prev ? {
      ...prev,
      performanceMonitoring: { ...prev.performanceMonitoring, ...updates }
    } : null);
  };

  const updateSEOMonitoring = (updates: Partial<AnalyticsSettingsType['seoMonitoring']>) => {
    setSettings(prev => prev ? {
      ...prev,
      seoMonitoring: { ...prev.seoMonitoring, ...updates }
    } : null);
  };

  const updateAlerts = (updates: Partial<AnalyticsSettingsType['alerts']>) => {
    setSettings(prev => prev ? {
      ...prev,
      alerts: { ...prev.alerts, ...updates }
    } : null);
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure analytics tools, monitoring, and alerting preferences
          </p>
        </div>

        <Button onClick={saveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Google Analytics Settings */}
      <SettingSection
        title="Google Analytics"
        description="Configure Google Analytics tracking and integration"
        icon={<BarChart3 className="w-5 h-5" />}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Enable Google Analytics</label>
              <p className="text-xs text-muted-foreground mt-1">
                Track website visitors, behavior, and conversions
              </p>
            </div>
            <Switch
              checked={settings.googleAnalytics.enabled}
              onCheckedChange={(enabled) => updateGoogleAnalytics({ enabled })}
            />
          </div>

          {settings.googleAnalytics.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tracking ID</label>
                <div className="flex gap-2">
                  <Input
                    value={settings.googleAnalytics.trackingId}
                    onChange={(value: string) => updateGoogleAnalytics({ trackingId: value })}
                    placeholder="GA-XXXXXXXXXX"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={testGoogleAnalytics}
                    disabled={testingGA}
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    {testingGA ? 'Testing...' : 'Test'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex items-center gap-2">
                  {settings.googleAnalytics.trackingId ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600">Configured</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-orange-600">Not Configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {settings.googleAnalytics.enabled && (
            <div>
              <label className="block text-sm font-medium mb-3">Goals</label>
              <div className="space-y-2">
                {settings.googleAnalytics.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Badge variant="outline">{goal.type}</Badge>
                    <span className="flex-1 font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.type === 'destination' && `URL: ${goal.value}`}
                      {goal.type === 'duration' && `Time: ${goal.value}s`}
                      {goal.type === 'pagesPerSession' && `Pages: ${goal.value}`}
                      {goal.type === 'event' && `Event: ${goal.value}`}
                    </span>
                  </div>
                ))}
                <Button variant="outline" size="sm">
                  Add Goal
                </Button>
              </div>
            </div>
          )}
        </div>
      </SettingSection>

      {/* Performance Monitoring */}
      <SettingSection
        title="Performance Monitoring"
        description="Configure Core Web Vitals monitoring and error tracking"
        icon={<Activity className="w-5 h-5" />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Real User Monitoring</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor real user performance
                </p>
              </div>
              <Switch
                checked={settings.performanceMonitoring.realUserMonitoring}
                onCheckedChange={(checked) => updatePerformanceMonitoring({ realUserMonitoring: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Synthetic Monitoring</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automated performance tests
                </p>
              </div>
              <Switch
                checked={settings.performanceMonitoring.syntheticMonitoring}
                onCheckedChange={(checked) => updatePerformanceMonitoring({ syntheticMonitoring: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Error Tracking</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor JavaScript errors
                </p>
              </div>
              <Switch
                checked={settings.performanceMonitoring.errorTracking}
                onCheckedChange={(checked) => updatePerformanceMonitoring({ errorTracking: checked })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Performance Thresholds</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">LCP (seconds)</label>
                <Input
                  type="number"
                  value={settings.performanceMonitoring.thresholds.lcp.toString()}
                  onChange={(value: string) => updatePerformanceMonitoring({
                    thresholds: {
                      ...settings.performanceMonitoring.thresholds,
                      lcp: parseFloat(value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">FID (ms)</label>
                <Input
                  type="number"
                  value={settings.performanceMonitoring.thresholds.fid.toString()}
                  onChange={(value: string) => updatePerformanceMonitoring({
                    thresholds: {
                      ...settings.performanceMonitoring.thresholds,
                      fid: parseFloat(value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">CLS</label>
                <Input
                  type="number"
                  value={settings.performanceMonitoring.thresholds.cls.toString()}
                  onChange={(value: string) => updatePerformanceMonitoring({
                    thresholds: {
                      ...settings.performanceMonitoring.thresholds,
                      cls: parseFloat(value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">TTFB (ms)</label>
                <Input
                  type="number"
                  value={settings.performanceMonitoring.thresholds.ttfb.toString()}
                  onChange={(value: string) => updatePerformanceMonitoring({
                    thresholds: {
                      ...settings.performanceMonitoring.thresholds,
                      ttfb: parseFloat(value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* SEO Monitoring */}
      <SettingSection
        title="SEO Monitoring"
        description="Configure keyword tracking and competitor monitoring"
        icon={<Search className="w-5 h-5" />}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Automated SEO Audits</label>
              <p className="text-xs text-muted-foreground mt-1">
                Run automated SEO checks daily
              </p>
            </div>
            <Switch
              checked={settings.seoMonitoring.automatedAudits}
              onCheckedChange={(checked) => updateSEOMonitoring({ automatedAudits: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Scheduled Reports</label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive weekly SEO performance reports
              </p>
            </div>
            <Switch
              checked={settings.seoMonitoring.scheduledReports}
              onCheckedChange={(checked) => updateSEOMonitoring({ scheduledReports: checked })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Keyword Tracking</label>
            <div className="space-y-2">
              {settings.seoMonitoring.keywordTracking.map((keyword, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">{keyword.keyword}</span>
                  <Badge variant="outline">Target: #{keyword.targetPosition}</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm">
                Add Keyword
              </Button>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Alert Settings */}
      <SettingSection
        title="Alert Settings"
        description="Configure notifications for performance and SEO issues"
        icon={<AlertTriangle className="w-5 h-5" />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Alerts */}
          <div>
            <h4 className="font-medium mb-4">Performance Alerts</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Performance Alerts</label>
                <Switch
                  checked={settings.alerts.performance.enabled}
                  onCheckedChange={(enabled) => updateAlerts({
                    performance: { ...settings.alerts.performance, enabled }
                  })}
                />
              </div>

              {settings.alerts.performance.enabled && (
                <div className="space-y-3 ml-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">LCP Threshold (seconds)</label>
                    <Input
                      type="number"
                      value={settings.alerts.performance.lcpThreshold.toString()}
                      onChange={(value: string) => updateAlerts({
                        performance: {
                          ...settings.alerts.performance,
                          lcpThreshold: parseFloat(value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">FID Threshold (ms)</label>
                    <Input
                      type="number"
                      value={settings.alerts.performance.fidThreshold.toString()}
                      onChange={(value: string) => updateAlerts({
                        performance: {
                          ...settings.alerts.performance,
                          fidThreshold: parseFloat(value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">CLS Threshold</label>
                    <Input
                      type="number"
                      value={settings.alerts.performance.clsThreshold.toString()}
                      onChange={(value: string) => updateAlerts({
                        performance: {
                          ...settings.alerts.performance,
                          clsThreshold: parseFloat(value) || 0
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO Alerts */}
          <div>
            <h4 className="font-medium mb-4">SEO Alerts</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable SEO Alerts</label>
                <Switch
                  checked={settings.alerts.seo.enabled}
                  onCheckedChange={(enabled) => updateAlerts({
                    seo: { ...settings.alerts.seo, enabled }
                  })}
                />
              </div>

              {settings.alerts.seo.enabled && (
                <div className="space-y-3 ml-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Keyword Drop Threshold (%)</label>
                    <Input
                      type="number"
                      value={settings.alerts.seo.keywordDropThreshold.toString()}
                      onChange={(value: string) => updateAlerts({
                        seo: {
                          ...settings.alerts.seo,
                          keywordDropThreshold: parseFloat(value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">New Backlinks Threshold</label>
                    <Input
                      type="number"
                      value={settings.alerts.seo.newBacklinksThreshold.toString()}
                      onChange={(value: string) => updateAlerts({
                        seo: {
                          ...settings.alerts.seo,
                          newBacklinksThreshold: parseInt(value) || 0
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={testGoogleAnalytics}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Test GA Connection
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview Dashboard
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
