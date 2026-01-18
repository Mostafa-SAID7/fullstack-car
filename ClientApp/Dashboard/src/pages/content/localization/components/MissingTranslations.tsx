import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Type, List } from 'lucide-react';
import { localizationService, type TranslationValidationResult } from '../../../../services/localization/localization-admin.service';
import { useToast } from '../../../../hooks';
import { cn } from '../../../../lib/utils';

export const MissingTranslations: React.FC = () => {
    const { success, error } = useToast();
    const [languages, setLanguages] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [validationResult, setValidationResult] = useState<TranslationValidationResult | null>(null);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchLanguages = async () => {
            const result = await localizationService.getSupportedCultures();
            if (result.succeeded && result.data) {
                setLanguages(result.data);
                if (result.data.length > 0) setSelectedLanguage(result.data[0]);
            }
        };
        fetchLanguages();
    }, []);

    const handleValidate = async () => {
        if (!selectedLanguage) return;
        setLoading(true);
        try {
            const result = await localizationService.validateTranslations(selectedLanguage);
            if (result.succeeded && result.data) {
                setValidationResult(result.data);
                success('Validation completed successfully');
            } else {
                error(result.message || 'Validation failed');
            }
        } catch (err) {
            error('An error occurred during validation');
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
            <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Select Language to Validate Against (en-US)</label>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20"
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleValidate}
                        disabled={loading || !selectedLanguage}
                        className="h-10 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Run Validation
                    </button>
                </div>
            </div>

            {validationResult && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-card p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <List className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Total Features</span>
                        </div>
                        <div className="text-2xl font-bold">{validationResult.summary.totalFeatures}</div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Type className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Issues</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">{validationResult.summary.totalIssues}</div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Missing Keys</span>
                        </div>
                        {/* Summary object doesn't have lists, just counts. We need to check Report object for details if we want list. */}
                        {/* Assuming Report structure matches what we need or we update Interface */}
                        <div className="text-2xl font-bold text-red-600">{validationResult.report?.TotalMissingKeys || 0}</div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Completion</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{validationResult.summary.overallCompletionPercentage}%</div>
                    </div>
                </div>
            )}

            {validationResult && validationResult.report?.FeatureReports && (
                <div className="space-y-4">
                    {validationResult.report.FeatureReports.map((featureReport: any, idx: number) => (
                        featureReport.MissingKeys && featureReport.MissingKeys.length > 0 && (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50/50 border border-red-200 rounded-2xl overflow-hidden"
                            >
                                <div className="p-4 bg-red-100/50 border-b border-red-200 flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <h3 className="font-semibold text-red-900">
                                        {featureReport.Feature} - Missing Translations ({featureReport.MissingKeys.length})
                                    </h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto p-4">
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {featureReport.MissingKeys.map((key: string) => (
                                            <li key={key} className="text-sm font-mono text-red-700 bg-red-100/30 px-3 py-1.5 rounded-lg border border-red-200/50 truncate" title={key}>
                                                {key}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )
                    ))}
                </div>
            )}
        </motion.div>
    );
};
