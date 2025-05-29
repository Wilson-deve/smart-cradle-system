import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
  BellIcon,
  ChartBarIcon,
  HomeIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import { toast } from '@/Components/ui/use-toast';
import Sidebar from '@/Components/RoleBased/Sidebar';
import { Role } from '@/types/roles';

interface Props {
  user: {
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function BabysitterLayout({ user, children }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/babysitter/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.put(`/api/babysitter/notifications/${notificationId}/read`);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar userRole={Role.BABYSITTER} className="w-64 flex-shrink-0" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/images/logo.png"
                alt="Smart Cradle"
              />
            </div>

            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="border-b border-gray-200 px-4 py-2">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-2 hover:bg-gray-50 ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
