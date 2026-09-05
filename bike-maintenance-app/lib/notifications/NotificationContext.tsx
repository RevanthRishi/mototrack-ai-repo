import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Notification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notify: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification['type'] = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications.length > 0 && (
        <View style={styles.container}>
          {notifications.map(n => (
            <View key={n.id} style={styles.toast}>
              <View style={[styles.dot, styles[`dot_${n.type || 'success'}`]]} />
              <Text style={styles.toastText}>{n.message}</Text>
              <TouchableOpacity onPress={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toast: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dot_success: { backgroundColor: '#10b981' },
  dot_error: { backgroundColor: '#ef4444' },
  dot_info: { backgroundColor: '#3b82f6' },
  dot_warning: { backgroundColor: '#f59e0b' },
  toastText: { color: '#fff', fontSize: 14, flex: 1 },
  closeText: { color: '#94a3b8', fontSize: 18 },
});
