// Dashboard Model Component Props Types

export interface ModelTrainingProps {
  isTraining: boolean;
  progress?: number;
  status?: string;
  onStart?: () => void;
  onStop?: () => void;
}







