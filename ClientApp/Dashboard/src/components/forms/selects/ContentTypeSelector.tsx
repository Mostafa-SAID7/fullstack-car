// Content Type Selector Component

import React from 'react';
import { Select } from './Select';

export type ContentType = 
  | 'page' 
  | 'post' 
  | 'article' 
  | 'media' 
  | 'document' 
  | 'template' 
  | 'widget';

export interface ContentTypeOption {
  value: ContentType;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface ContentTypeSelectorProps {
  value?: ContentType;
  onChange: (value: ContentType) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  {
    value: 'page',
    label: 'Page',
    description: 'Static content page'
  },
  {
    value: 'post',
    label: 'Post',
    description: 'Blog post or news article'
  },
  {
    value: 'article',
    label: 'Article',
    description: 'Long-form content article'
  },
  {
    value: 'media',
    label: 'Media',
    description: 'Image, video, or audio content'
  },
  {
    value: 'document',
    label: 'Document',
    description: 'PDF or other document file'
  },
  {
    value: 'template',
    label: 'Template',
    description: 'Reusable content template'
  },
  {
    value: 'widget',
    label: 'Widget',
    description: 'Interactive content widget'
  }
];

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select content type',
  disabled = false,
  error,
  required = false,
  className
}) => {
  const options = CONTENT_TYPE_OPTIONS.map(option => ({
    value: option.value,
    label: option.label
  }));

  return (
    <Select
      value={value}
      onChange={(val) => onChange(val as ContentType)}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      required={required}
      className={className}
    />
  );
};

export default ContentTypeSelector;