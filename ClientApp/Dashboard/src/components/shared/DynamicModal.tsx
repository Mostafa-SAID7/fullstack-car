import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, User, Package, Users, AlertCircle, Wrench } from 'lucide-react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../layout/modals/Modal';

export type ModalType = 'user' | 'customer' | 'product' | 'service' | 'custom';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title?: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

const modalConfigs = {
  user: {
    icon: User,
    title: 'Add New User',
    description: 'Create a new user account with the required information.',
    submitLabel: 'Create User',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20'
  },
  customer: {
    icon: Users,
    title: 'Add New Customer',
    description: 'Register a new customer in the system.',
    submitLabel: 'Create Customer',
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100 dark:bg-green-900/20'
  },
  product: {
    icon: Package,
    title: 'Add New Product',
    description: 'Add a new product to your inventory.',
    submitLabel: 'Create Product',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100 dark:bg-purple-900/20'
  },
  service: {
    icon: Wrench,
    title: 'Add New Service',
    description: 'Create a new marketplace service offering.',
    submitLabel: 'Create Service',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20'
  },
  custom: {
    icon: Plus,
    title: 'Add New Item',
    description: 'Create a new item.',
    submitLabel: 'Create',
    iconColor: 'text-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-900/20'
  }
};

export const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  description,
  fields,
  onSubmit,
  submitLabel,
  loading = false,
  size = 'lg'
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = modalConfigs[type];
  const IconComponent = config.icon;

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation;
      
      if (min && value && value.length < min) {
        return message || `${field.label} must be at least ${min} characters`;
      }
      
      if (max && value && value.length > max) {
        return message || `${field.label} must be no more than ${max} characters`;
      }
      
      if (pattern && value && !new RegExp(pattern).test(value)) {
        return message || `${field.label} format is invalid`;
      }
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.key]);
      if (error) {
        newErrors[field.key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({});
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] || '';
    const error = errors[field.key];

    switch (field.type) {
      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                error ? 'border-destructive' : 'border-border'
              }`}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                error ? 'border-destructive' : 'border-border'
              }`}
            />
            {error && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.key}
              checked={value || false}
              onChange={(e) => handleInputChange(field.key, e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20 focus:ring-2"
            />
            <label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            {error && (
              <div className="flex items-center gap-1 text-sm text-destructive ml-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                error ? 'border-destructive' : 'border-border'
              }`}
            />
            {error && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={size}
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.iconBg}`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {title || config.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {description || config.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ml-4 p-2 rounded-lg hover:bg-muted transition-colors group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          </button>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-6">
            {fields.map(renderField)}
          </div>
        </ModalContent>

        <ModalFooter>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting || loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {submitLabel || config.submitLabel}
              </>
            )}
          </motion.button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default DynamicModal;