import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Settings, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Test component to verify React 18+, Shadcn/ui, Tailwind CSS, and Lucide React setup
 */
export const SetupTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard Admin App
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            React 18+ with Modern Architecture Setup Complete
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                React 19.2.0
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Modern React with functional components, hooks, and concurrent features
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Shadcn/ui
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Beautiful, accessible components built with Radix UI and Tailwind CSS
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Tailwind CSS
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Utility-first CSS framework with custom configuration and dark mode
            </p>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React', version: '19.2.0', status: 'ready' },
              { name: 'TypeScript', version: '5.9.3', status: 'ready' },
              { name: 'Vite', version: '7.2.4', status: 'ready' },
              { name: 'Tailwind CSS', version: '4.1.18', status: 'ready' },
              { name: 'Shadcn/ui', version: 'Latest', status: 'ready' },
              { name: 'Lucide React', version: '0.562.0', status: 'ready' },
              { name: 'Framer Motion', version: '12.23.26', status: 'ready' },
              { name: 'React Router', version: '7.11.0', status: 'ready' }
            ].map((tech) => (
              <div
                key={tech.name}
                className={cn(
                  "p-3 rounded-lg border",
                  "bg-white dark:bg-slate-800",
                  "border-slate-200 dark:border-slate-700"
                )}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {tech.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  v{tech.version}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.href = '/dashboard'}
          >
            <Settings className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/login'}
          >
            <Users className="w-5 h-5 mr-2" />
            Admin Login
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">
            Dashboard Admin App - Modern React Architecture
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Built with React 18+, TypeScript, Vite, Shadcn/ui, Tailwind CSS, and Lucide React
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupTest;