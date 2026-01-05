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
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
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
  className
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
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />

          {/* Modal */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full mx-auto bg-card border border-border rounded-lg shadow-xl',
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            {(title || description || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-lg font-semibold text-foreground">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 p-1 rounded-md hover:bg-muted transition-colors group"
                  >
                    <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
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
    className={cn('flex items-center justify-between p-6 border-b border-border', className)}
    {...props}
  />
));

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('p-6', className)}
    {...props}
  />
));

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-end gap-3 p-6 border-t border-border', className)}
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

