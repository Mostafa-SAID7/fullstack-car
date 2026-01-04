import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'calc(var(--radius) - 2px)',
            boxShadow: '0 10px 15px -3px hsl(var(--border) / 0.2), 0 4px 6px -4px hsl(var(--border) / 0.15)',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--card))',
            },
            style: {
              borderColor: 'hsl(var(--primary) / 0.3)',
              background: 'hsl(var(--primary) / 0.05)',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--card))',
            },
            style: {
              borderColor: 'hsl(var(--destructive) / 0.3)',
              background: 'hsl(var(--destructive) / 0.05)',
            },
          },
          loading: {
            style: {
              borderColor: 'hsl(var(--muted))',
              background: 'hsl(var(--muted) / 0.05)',
            },
          },
        }}
      />
    </>
  );
};
