import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, Download, Play } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface LoadingStateProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  progress?: number;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'upload' | 'download' | 'processing';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  size = 'md',
  text,
  progress,
  variant = 'spinner'
}) => {
  const sizes = {
    xs: { icon: 'w-3 h-3', text: 'text-xs', container: 'gap-1' },
    sm: { icon: 'w-4 h-4', text: 'text-sm', container: 'gap-2' },
    md: { icon: 'w-6 h-6', text: 'text-base', container: 'gap-3' },
    lg: { icon: 'w-8 h-8', text: 'text-lg', container: 'gap-4' },
    xl: { icon: 'w-12 h-12', text: 'text-xl', container: 'gap-5' }
  };

  const renderIcon = () => {
    const iconClass = cn('text-primary', sizes[size].icon);
    
    switch (variant) {
      case 'upload':
        return <Upload className={cn(iconClass, 'animate-bounce')} />;
      case 'download':
        return <Download className={cn(iconClass, 'animate-bounce')} />;
      case 'processing':
        return <Play className={cn(iconClass, 'animate-pulse')} />;
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn('bg-primary rounded-full', 
                  size === 'xs' ? 'w-1 h-1' : 
                  size === 'sm' ? 'w-1.5 h-1.5' : 
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <motion.div
            className={cn('bg-primary rounded-full', sizes[size].icon)}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
        );
      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={cn('bg-primary rounded-sm', 
                  size === 'xs' ? 'w-1' : 
                  size === 'sm' ? 'w-1.5' : 
                  size === 'md' ? 'w-2' :
                  size === 'lg' ? 'w-3' : 'w-4'
                )}
                style={{ 
                  height: size === 'xs' ? '12px' : 
                         size === 'sm' ? '16px' : 
                         size === 'md' ? '24px' : 
                         size === 'lg' ? '32px' : '48px' 
                }}
                animate={{
                  scaleY: [1, 0.3, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        );
      default:
        return <Loader2 className={cn(iconClass, 'animate-spin')} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', sizes[size].container, className)}>
      {renderIcon()}
      
      {text && (
        <p className={cn('text-muted-foreground animate-pulse', sizes[size].text)}>
          {text}
        </p>
      )}
      
      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between items-center mb-1">
            <span className={cn('text-muted-foreground', sizes[size].text)}>
              Progress
            </span>
            <span className={cn('text-muted-foreground', sizes[size].text)}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized loading components
export const UploadProgress: React.FC<{
  progress: number;
  fileName?: string;
  fileSize?: string;
  className?: string;
}> = ({ progress, fileName, fileSize, className }) => (
  <div className={cn('p-4 border border-border rounded-lg bg-card', className)}>
    <div className="flex items-center gap-3 mb-3">
      <Upload className="w-5 h-5 text-primary animate-bounce" />
      <div className="flex-1 min-w-0">
        {fileName && (
          <p className="text-sm font-medium text-foreground truncate">
            {fileName}
          </p>
        )}
        {fileSize && (
          <p className="text-xs text-muted-foreground">
            {fileSize}
          </p>
        )}
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Uploading...
        </span>
        <span className="text-sm font-medium text-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  </div>
);

export const ProcessingState: React.FC<{
  stage: string;
  stages: string[];
  currentStage: number;
  className?: string;
}> = ({ stage, stages, currentStage, className }) => (
  <div className={cn('p-6 text-center', className)}>
    <div className="mb-4">
      <Play className="w-8 h-8 text-primary animate-pulse mx-auto" />
    </div>
    
    <h3 className="text-lg font-medium text-foreground mb-2">
      Processing your media
    </h3>
    
    <p className="text-sm text-muted-foreground mb-4">
      {stage}
    </p>
    
    <div className="space-y-2">
      {stages.map((stageName, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg transition-colors',
            index < currentStage && 'bg-green-50 text-green-700',
            index === currentStage && 'bg-primary/10 text-primary',
            index > currentStage && 'text-muted-foreground'
          )}
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              index < currentStage && 'bg-green-500',
              index === currentStage && 'bg-primary animate-pulse',
              index > currentStage && 'bg-muted'
            )}
          />
          <span className="text-sm">{stageName}</span>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonLoader: React.FC<{
  type: 'card' | 'list' | 'table' | 'form' | 'media';
  count?: number;
  className?: string;
}> = ({ type, count = 1, className }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="p-4 border border-border rounded-lg bg-card animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2 mb-4" />
            <div className="h-32 bg-muted rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-20" />
              <div className="h-8 bg-muted rounded w-16" />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-3/4 mb-1" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="animate-pulse">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        );
      
      case 'form':
        return (
          <div className="space-y-4 animate-pulse">
            <div>
              <div className="h-4 bg-muted rounded w-24 mb-2" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div>
              <div className="h-4 bg-muted rounded w-32 mb-2" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        );
      
      case 'media':
        return (
          <div className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        );
      
      default:
        return (
          <div className="h-4 bg-muted rounded animate-pulse" />
        );
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingState;