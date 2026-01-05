// Dataset Upload Types

import type { DatasetType } from './dataset';
import type { DatasetPreprocessing, DatasetSplit } from './preprocessing';

export interface DatasetUpload {
  file: File;
  name: string;
  type: DatasetType;
  description?: string;
  preprocessing: DatasetPreprocessing;
  split: DatasetSplit;
}
