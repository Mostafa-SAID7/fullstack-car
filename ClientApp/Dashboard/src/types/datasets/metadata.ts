// Dataset Metadata Types

export interface DatasetMetadata {
  format: 'json' | 'csv' | 'txt' | 'parquet';
  encoding: string;
  language: string;
  domain: string;
  source: string;
  license?: string;
  version: string;
}
