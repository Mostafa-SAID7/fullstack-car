import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { TranslationDto } from '../../../../services/localization/localization-admin.service';
import { Pagination } from '../../../../components/shared/Pagination';

export const TranslationsTable: React.FC<{
    translations: TranslationDto[];
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (translation: TranslationDto) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (translation: TranslationDto) => void;
}> = ({ translations, totalCount, currentPage, onPageChange, onEdit, onDelete, onToggleStatus }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
            <div className="p-6 border-b border-border/50">
                <h3 className="text-lg font-semibold">Translations</h3>
                <p className="text-sm text-muted-foreground">
                    {translations.length} items shown
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Key</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {translations.map((translation) => (
                            <motion.tr
                                key={translation.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-muted/30 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-foreground">{translation.key}</div>
                                    {translation.description && (
                                        <div className="text-xs text-muted-foreground">{translation.description}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-foreground max-w-xs truncate" title={translation.value}>
                                        {translation.value}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {translation.language}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                        {translation.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(translation)}
                                        className={cn(
                                            "inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors",
                                            translation.isActive
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : "bg-red-100 text-red-800 hover:bg-red-200"
                                        )}
                                    >
                                        {translation.isActive ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                                        {translation.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(translation)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(translation.id)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={20}
                onPageChange={onPageChange}
                showItemsPerPageSelector={false}
                showInfo={true}
            />
        </motion.div>
    );
};
