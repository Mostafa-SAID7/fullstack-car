import React, { useState } from 'react';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const LanguageSwitcherDemo: React.FC = () => {
  const [variant, setVariant] = useState<'dropdown' | 'inline'>('dropdown');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showFlags, setShowFlags] = useState(true);
  const [showNativeNames, setShowNativeNames] = useState(true);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Enhanced Language Switcher Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test the enhanced language switcher with all 4 supported languages: en-US, ar-EG, ar-AE, ar-SA
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Variant</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as 'dropdown' | 'inline')}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="dropdown">Dropdown</option>
              <option value="inline">Inline</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showFlags}
                onChange={(e) => setShowFlags(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Show Flags</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showNativeNames}
                onChange={(e) => setShowNativeNames(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Show Native Names</span>
            </label>
          </div>
        </div>
      </div>

      {/* Demo Sections */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Language Switcher</h3>
          <div className="flex justify-center">
            <LanguageSwitcher
              variant={variant}
              size={size}
              showFlags={showFlags}
              showNativeNames={showNativeNames}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Different Positions</h3>
          <div className="space-y-4">
            <div className="flex justify-start">
              <LanguageSwitcher
                variant="dropdown"
                size="sm"
                showFlags={true}
                showNativeNames={false}
                position="left"
              />
              <span className="ml-4 text-sm text-gray-600 dark:text-gray-400 self-center">Left aligned</span>
            </div>
            
            <div className="flex justify-center">
              <LanguageSwitcher
                variant="dropdown"
                size="sm"
                showFlags={true}
                showNativeNames={false}
                position="center"
              />
              <span className="ml-4 text-sm text-gray-600 dark:text-gray-400 self-center">Center aligned</span>
            </div>
            
            <div className="flex justify-end">
              <LanguageSwitcher
                variant="dropdown"
                size="sm"
                showFlags={true}
                showNativeNames={false}
                position="right"
              />
              <span className="mr-4 text-sm text-gray-600 dark:text-gray-400 self-center">Right aligned</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">All Sizes</h3>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <LanguageSwitcher variant="dropdown" size="sm" showFlags={true} />
              <p className="text-xs text-gray-500 mt-2">Small</p>
            </div>
            <div className="text-center">
              <LanguageSwitcher variant="dropdown" size="md" showFlags={true} />
              <p className="text-xs text-gray-500 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <LanguageSwitcher variant="dropdown" size="lg" showFlags={true} />
              <p className="text-xs text-gray-500 mt-2">Large</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Features Demonstration</h3>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>All 4 supported languages: en-US, ar-EG, ar-AE, ar-SA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Flag icons for visual identification</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Immediate language switching without page reload</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>User preference persistence to localStorage</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>RTL support for Arabic languages</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Keyboard navigation support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Loading and error states</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Accessibility features (ARIA labels, roles)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Language Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Current Language Info</h4>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <p>Document Direction: <code>{document.documentElement.dir || 'ltr'}</code></p>
          <p>Document Language: <code>{document.documentElement.lang || 'en-US'}</code></p>
          <p>Stored Preference: <code>{localStorage.getItem('preferred-language') || 'none'}</code></p>
        </div>
      </div>
    </div>
  );
};