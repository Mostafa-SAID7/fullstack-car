import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, Globe, ArrowRight, CalendarDays, History } from 'lucide-react';
import { localizationService, type TranslationUpdateDto } from '../../../../components/services/localization';
import { useToast } from '../../../../hooks';
import { format } from 'date-fns';

export const TranslationActivity: React.FC = () => {
    const { success, error } = useToast();
    const [updates, setUpdates] = useState<TranslationUpdateDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCulture, setSelectedCulture] = useState<string>('en-US');
    const [supportedCultures, setSupportedCultures] = useState<string[]>([]);
    // Default to 7 days ago
    const [sinceDate, setSinceDate] = useState<string>(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    useEffect(() => {
        const fetchLanguages = async () => {
            const result = await localizationService.getSupportedCultures();
            if (result.succeeded && result.data) {
                setSupportedCultures(result.data);
                if (result.data.includes('en-US')) setSelectedCulture('en-US');
                else if (result.data.length > 0) setSelectedCulture(result.data[0]);
            }
        };
        fetchLanguages();
    }, []);

    const fetchUpdates = async () => {
        if (!selectedCulture) return;
        setLoading(true);
        try {
            // Check updates since selected date
            const sinceIso = new Date(sinceDate).toISOString();
            const result = await localizationService.getTranslationUpdates(selectedCulture, sinceIso, []);

            if (result.succeeded && result.data) {
                setUpdates(result.data);
                if (result.data.length === 0) {
                    success('No updates found for this period');
                }
            } else {
                error(result.message || 'Failed to fetch updates');
            }
        } catch (err) {
            error('An error occurred while fetching updates');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Controls */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            Culture
                        </label>
                        <select
                            value={selectedCulture}
                            onChange={(e) => setSelectedCulture(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                        >
                            {supportedCultures.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            Updates Since
                        </label>
                        <input
                            type="date"
                            value={sinceDate}
                            onChange={(e) => setSinceDate(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <button
                        onClick={fetchUpdates}
                        disabled={loading || !selectedCulture}
                        className="h-10 px-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
                        {loading ? 'Fetching...' : 'View Updates'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {updates.length > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                        <h3 className="font-semibold flex items-center gap-2">
                            <History className="w-4 h-4 text-muted-foreground" />
                            Recent Activity
                        </h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                            {updates.length} Changes
                        </span>
                    </div>
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="w-full">
                            <thead className="bg-muted/50 sticky top-0 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Key</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Value</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Feature</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {updates.map((update, idx) => (
                                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-3 text-sm font-medium text-foreground">{update.key}</td>
                                        <td className="px-6 py-3 text-sm text-foreground max-w-xs truncate" title={update.value}>{update.value}</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100/50 text-purple-700 rounded-lg border border-purple-200/50">
                                                {update.feature}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-xs text-muted-foreground font-mono">
                                            {format(new Date(update.timestamp), 'MMM d, HH:mm')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {updates.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-muted/5">
                    <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <History className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="font-medium">No updates found</p>
                    <p className="text-sm">Try selecting a different date range or culture.</p>
                </div>
            )}
        </motion.div>
    );
};
