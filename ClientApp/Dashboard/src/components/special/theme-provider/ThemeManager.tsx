import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '../../forms/buttons/Button';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeManagerProps {
  className?: string;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>('system');

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }

    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Load theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <Button
          variant={theme === 'light' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleThemeChange('light')}
          className="gap-2"
        >
          <Sun className="w-4 h-4" />
          Light
        </Button>

        <Button
          variant={theme === 'dark' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleThemeChange('dark')}
          className="gap-2"
        >
          <Moon className="w-4 h-4" />
          Dark
        </Button>

        <Button
          variant={theme === 'system' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleThemeChange('system')}
          className="gap-2"
        >
          <Monitor className="w-4 h-4" />
          System
        </Button>
      </div>
    </div>
  );
};

export default ThemeManager;
