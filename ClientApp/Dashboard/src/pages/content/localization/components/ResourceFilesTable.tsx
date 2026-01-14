import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Calendar, Database, HardDrive, ExternalLink } from 'lucide-react';
import type { ResourceFileDto } from '../../../../components/services/localization';

export const ResourceFilesTable: React.FC<{
    files: ResourceFileDto[];
    loading: boolean;
}> = ({ files, loading }) => {
    if (loading) {
        return <div className="p-12 text-center text-muted-foreground">Loading resource files...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden mt-6"
        >
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-blue-500" />
                        Resource Files
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        View underlying JSON localization files on disk
                    </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        {files.length} Files
                    </div>
                    <div className="flex items-center gap-1">
                        <HardDrive className="w-4 h-4" />
                        {(files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Feature</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Culture</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Keys</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Modified</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Path</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {files.map((file, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <FileCode className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-foreground">{file.fileName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                        {file.feature}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                    {file.culture}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-mono">
                                    {file.keyCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(file.lastModified).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div
                                        className="text-xs text-muted-foreground font-mono truncate max-w-[200px] inline-block"
                                        title={file.path}
                                    >
                                        {file.path}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};
