import React from 'react';
import { Moon, Sun, Monitor, Type } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/layout/cards/Card';
import { useTranslation } from 'react-i18next';

export const AppearanceSettings: React.FC = () => {
    const { t } = useTranslation();

    // Mock state for now, would typically come from a theme context
    const theme = 'system';
    const setTheme = (t: string) => console.log('Set theme to', t);

    return (
        <Card hover className="border-border/50 shadow-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">{t('appearance', 'Appearance')}</CardTitle>
                </div>
                <CardDescription>{t('appearance_desc', 'Customize how the dashboard looks and feels')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="font-medium mb-4">Theme Preference</div>

                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${(theme as string) === 'light' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'
                                }`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-white border shadow-sm flex items-center justify-center mb-2">
                                <Sun className="w-6 h-6 text-orange-500" />
                            </div>
                            <span className="text-sm font-medium">Light</span>
                        </button>

                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${(theme as string) === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'
                                }`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-zinc-950 border shadow-sm flex items-center justify-center mb-2">
                                <Moon className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="text-sm font-medium">Dark</span>
                        </button>

                        <button
                            onClick={() => setTheme('system')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'
                                }`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-white to-zinc-950 border shadow-sm flex items-center justify-center mb-2">
                                <Monitor className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium">System</span>
                        </button>
                    </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Type className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Compact Mode</span>
                        </div>
                        {/* Toggle switch placeholder */}
                        <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                        Reduce spacing and font sizes to fit more content on screen.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
