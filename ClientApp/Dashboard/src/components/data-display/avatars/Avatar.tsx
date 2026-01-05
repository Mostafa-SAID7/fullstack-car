import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circular' | 'rounded' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacing?: 'tight' | 'normal' | 'loose';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'circular',
  status,
  showStatus = false,
  statusPosition = 'bottom-right',
  className,
  children,
  ...props
}, ref) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };

  const variants = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  const statusPositions = {
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  const displayFallback = fallback || getInitials(alt);

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-block bg-muted text-muted-foreground flex items-center justify-center font-medium overflow-hidden',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          onBlur={() => { }} // dummy to avoid empty line but removing onLoad
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold">{displayFallback}</span>
      )}

      {showStatus && status && (
        <div
          className={cn(
            'absolute border-2 border-background rounded-full',
            statusColors[status],
            statusSizes[size],
            statusPositions[statusPosition]
          )}
        />
      )}

      {children}
    </div>
  );
});

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(({
  children,
  max = 5,
  size = 'md',
  spacing = 'normal',
  className,
  ...props
}, ref) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  const spacings = {
    tight: '-space-x-1',
    normal: '-space-x-2',
    loose: '-space-x-3'
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-center', spacings[spacing], className)}
      {...props}
    >
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative">
          {child}
        </div>
      ))}

      {remainingCount > 0 && (
        <Avatar
          size={size}
          className="ring-2 ring-background"
          fallback={`+${remainingCount}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
export default Avatar;
