"use client";

import { useState, useEffect } from 'react';
import { PropertyNotification } from '@/types/saved-features';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Home } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<PropertyNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?unread=true');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: PropertyNotification['type']) => {
    switch (type) {
      case 'new_property':
        return <Home className="h-5 w-5" />;
      case 'price_change':
        return <span className="text-lg">$</span>;
      case 'status_change':
        return <Check className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: PropertyNotification['type']) => {
    switch (type) {
      case 'new_property':
        return 'bg-green-100 text-green-800';
      case 'price_change':
        return 'bg-blue-100 text-blue-800';
      case 'status_change':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <Button
            variant="outline"
            onClick={() => notifications.forEach(n => markAsRead(n.id))}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-4" />
          <p>No new notifications</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                'p-4 transition-colors',
                !notification.read && 'bg-gray-50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-2 rounded-full',
                  getNotificationColor(notification.type)
                )}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                  {notification.property && (
                    <div className="mt-2">
                      <a
                        href={`/properties/${notification.property.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View property
                      </a>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
