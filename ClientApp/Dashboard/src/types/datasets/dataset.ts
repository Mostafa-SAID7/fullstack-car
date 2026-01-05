// Core Dataset Types
import type { BaseEntity } from '../common';
import type { DatasetMetadata } from './metadata';
import type { DatasetValidation } from './validation';

export interface Dataset extends BaseEntity {
  name: string;
  samples: number;
  size: string;
  type: DatasetType;
  lastUpdated: string;
  accuracy: number;
  description?: string;
  tags: string[];
  metadata: DatasetMetadata;
  validation: DatasetValidation;
}

export type DatasetType =
  | 'Q&A'
  | 'Conversation'
  | 'Instructions'
  | 'Classification'
  | 'Completion'
  | 'Translation'
  | 'Summarization';
