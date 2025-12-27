import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Notification, NotificationType } from '../types/notifications';
import { showNotificationToast } from '../utils/toast';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
  getNonMessagesBadgeCount: () => number;
  getMessagesBadgeCount: () => number;
  getNetworkBadgeCount: () => number;
  getCirclesBadgeCount: () => number;
  getForumBadgeCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage on init
    const stored = localStorage.getItem('circl_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('circl_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast popup
    showNotificationToast(
      notification.message,
      notification.type,
      getToastDuration(notification.type)
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNonMessagesBadgeCount = () => {
    return notifications.filter(
      n => !n.read && n.type !== 'message'
    ).length;
  };

  const getMessagesBadgeCount = () => {
    return notifications.filter(
      n => !n.read && (n.type === 'message')
    ).length;
  };

  const getNetworkBadgeCount = () => {
    return notifications.filter(
      n => !n.read && (n.type === 'connection' || n.type === 'mention')
    ).length;
  };

  const getCirclesBadgeCount = () => {
    return notifications.filter(
      n => !n.read && (n.type === 'circle_invite' || n.type === 'circle_update' || n.type === 'event')
    ).length;
  };

  const getForumBadgeCount = () => {
    return notifications.filter(
      n => !n.read && (n.type === 'comment' || n.type === 'reply' || n.type === 'like')
    ).length;
  };

  const getToastDuration = (type: NotificationType): number => {
    // Important notifications stay longer
    const importantTypes: NotificationType[] = ['circle_invite', 'event', 'connection', 'message'];
    if (importantTypes.includes(type)) return 5000;
    
    // Normal notifications
    const normalTypes: NotificationType[] = ['comment', 'reply', 'like', 'mention', 'circle_update'];
    if (normalTypes.includes(type)) return 4000;
    
    // Background notifications dismiss quickly
    return 3000;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        getUnreadCount,
        getNonMessagesBadgeCount,
        getMessagesBadgeCount,
        getNetworkBadgeCount,
        getCirclesBadgeCount,
        getForumBadgeCount,
      }}
    >
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
