import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { TranslationDto } from '../../../../services/localization/localization-admin.service';

export const TranslationForm: React.FC<{
    translation?: TranslationDto;
    onSave: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}> = ({ translation, onSave, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        key: translation?.key || '',
        value: translation?.value || '',
        language: translation?.language || 'en-US',
        category: translation?.category || 'common',
        description: translation?.description || '',
        isActive: translation?.isActive ?? true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.key) newErrors.key = 'Key is required';
        if (!formData.value) newErrors.value = 'Value is required';
        if (formData.key && !/^[a-zA-Z0-9_.-]+$/.test(formData.key)) {
            newErrors.key = 'Key contains invalid characters (use a-z, 0-9, _, ., -)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6"
        >
            <h3 className="text-lg font-semibold mb-4">
                {isEditing ? 'Edit Translation' : 'Add New Translation'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Translation Key</label>
                        <input
                            type="text"
                            value={formData.key}
                            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="e.g., welcome_message"
                            required
                        />
                        {errors.key && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.key}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Language</label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="en-US">English (en-US)</option>
                            <option value="ar-SA">Arabic (ar-SA)</option>
                            <option value="ar-AE">Arabic UAE (ar-AE)</option>
                            <option value="ar-EG">Arabic Egypt (ar-EG)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Translation Value</label>
                    <textarea
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[80px]"
                        placeholder="Enter the translated text..."
                        required
                    />
                    {errors.value && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.value}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={formData.isActive.toString()}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Brief description of this translation..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {isEditing ? 'Update' : 'Create'} Translation
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
