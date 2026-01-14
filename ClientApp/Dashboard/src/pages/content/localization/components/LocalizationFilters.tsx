import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const LocalizationFilters: React.FC<{
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
}> = ({ searchQuery, setSearchQuery, selectedLanguage, setSelectedLanguage, selectedCategory, setSelectedCategory }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
        >
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search translations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        <option value="">All Languages</option>
                        <option value="en-US">English</option>
                        <option value="ar-SA">Arabic (Saudi)</option>
                        <option value="ar-AE">Arabic (UAE)</option>
                        <option value="ar-EG">Arabic (Egypt)</option>
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        <option value="">All Categories</option>
                        <option value="common">Common</option>
                        <option value="dashboard">Dashboard</option>
                        <option value="navigation">Navigation</option>
                        <option value="auth">Authentication</option>
                        <option value="community">Community</option>
                        <option value="management">Management</option>
                        <option value="analytics">Analytics</option>
                        <option value="moderation">Moderation</option>
                        <option value="posts">Posts</option>
                        <option value="groups">Groups</option>
                        <option value="qa">Q&A</option>
                        <option value="reviews">Reviews</option>
                        <option value="social">Social Media</option>
                        <option value="marketplace">Marketplace</option>
                        <option value="media">Media / Studio</option>
                        <option value="marketing">Marketing</option>
                        <option value="system">System</option>
                        <option value="settings">Settings</option>
                        <option value="errors">Errors</option>
                        <option value="ai">AI Agent</option>
                        <option value="maps">Maps</option>
                        <option value="news">News</option>
                        <option value="guides">Guides</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
};
