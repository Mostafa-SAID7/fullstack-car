import React, { useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  glassmorphism?: boolean;
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  glassmorphism = true
}, ref) => {
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Enhanced Backdrop with glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleOverlayClick}
          />

          {/* Modal */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className={cn(
              'relative w-full mx-auto rounded-2xl shadow-2xl overflow-hidden',
              'max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh]',
              glassmorphism 
                ? 'glassmorphism border border-border/30' 
                : 'bg-card border border-border',
              sizeClasses[size],
              // Responsive width adjustments
              size === 'xs' && 'w-full max-w-xs',
              size === 'sm' && 'w-full max-w-sm',
              size === 'md' && 'w-full max-w-md sm:max-w-lg',
              size === 'lg' && 'w-full max-w-lg sm:max-w-xl md:max-w-2xl',
              size === 'xl' && 'w-full max-w-xl sm:max-w-2xl md:max-w-3xl',
              size === '2xl' && 'w-full max-w-2xl sm:max-w-3xl md:max-w-4xl',
              size === '3xl' && 'w-full max-w-3xl sm:max-w-4xl md:max-w-5xl',
              size === '4xl' && 'w-full max-w-4xl sm:max-w-5xl md:max-w-6xl',
              size === 'full' && 'w-[95vw] h-[95vh]',
              className
            )}
          >
            {/* Header */}
            {(title || description || showCloseButton) && (
              <div className={cn(
                'flex items-start justify-between p-4 sm:p-6 border-b',
                glassmorphism ? 'border-border/30 bg-muted/20' : 'border-border'
              )}>
                <div className="flex-1 min-w-0 pr-4">
                  {title && (
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={cn(
                      'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
                      'hover:bg-muted/50 hover:scale-105 active:scale-95',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20',
                      'group'
                    )}
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between p-4 sm:p-6 border-b border-border/30 bg-muted/20',
      className
    )}
    {...props}
  />
));

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('p-4 sm:p-6', className)}
    {...props}
  />
));

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6',
      'border-t border-border/30 bg-muted/20',
      className
    )}
    {...props}
  />
));

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalContent.displayName = 'ModalContent';
ModalFooter.displayName = 'ModalFooter';

export {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
};

export default Modal;

