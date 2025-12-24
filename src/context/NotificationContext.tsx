import React, { createContext, useContext, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  addNotification: (
    message: string,
    type: NotificationType,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const addNotification = (
    message: string,
    type: NotificationType = 'info',
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);

    switch (type) {
      case 'success':
        toast.success(message, { id, duration });
        break;
      case 'error':
        toast.error(message, { id, duration });
        break;
      case 'loading':
        toast.loading(message, { id });
        break;
      case 'info':
      default:
        toast(message, { id, duration });
        break;
    }
  };

  const removeNotification = (id: string) => {
    toast.remove(id);
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
