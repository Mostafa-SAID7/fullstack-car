import { useState, useCallback } from 'react';
import type { ModalType, FormField } from '../components/shared/DynamicModal';

export interface UseModalOptions {
  type: ModalType;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  title?: string;
  description?: string;
  submitLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface UseModalReturn {
  isOpen: boolean;
  loading: boolean;
  openModal: () => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
    type: ModalType;
    fields: FormField[];
    onSubmit: (data: Record<string, any>) => Promise<void> | void;
    title?: string;
    description?: string;
    submitLabel?: string;
    loading: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  };
}

export const useModal = (options: UseModalOptions): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLoading(false);
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, any>) => {
    setLoading(true);
    try {
      await options.onSubmit(data);
    } finally {
      setLoading(false);
    }
  }, [options.onSubmit]);

  const modalProps = {
    isOpen,
    onClose: closeModal,
    type: options.type,
    fields: options.fields,
    onSubmit: handleSubmit,
    title: options.title,
    description: options.description,
    submitLabel: options.submitLabel,
    loading,
    size: options.size
  };

  return {
    isOpen,
    loading,
    openModal,
    closeModal,
    setLoading,
    modalProps
  };
};

export default useModal;