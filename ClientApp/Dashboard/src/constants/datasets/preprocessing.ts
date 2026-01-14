// Dataset Preprocessing and Augmentation Constants

export const PREPROCESSING_TECHNIQUES = [
  { value: 'tokenization', label: 'Tokenization' },
  { value: 'normalization', label: 'Text Normalization' },
  { value: 'lowercase', label: 'Lowercase Conversion' },
  { value: 'remove_punctuation', label: 'Remove Punctuation' },
  { value: 'remove_stopwords', label: 'Remove Stop Words' },
  { value: 'stemming', label: 'Stemming' },
  { value: 'lemmatization', label: 'Lemmatization' }
] as const;

export const AUGMENTATION_TECHNIQUES = [
  { value: 'paraphrasing', label: 'Paraphrasing' },
  { value: 'back_translation', label: 'Back Translation' },
  { value: 'synonym_replacement', label: 'Synonym Replacement' },
  { value: 'random_insertion', label: 'Random Insertion' },
  { value: 'random_deletion', label: 'Random Deletion' },
  { value: 'random_swap', label: 'Random Swap' }
] as const;







