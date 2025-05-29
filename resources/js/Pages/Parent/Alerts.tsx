import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps } from '@/types';
import axios from 'axios';
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface Device {
  id: number;
  name: string;
  status: string;
  last_activity_at: string;
}

interface Alert {
  id: number;
  device_id: number;
  type: 'cry' | 'temperature' | 'humidity' | 'wetness' | 'motion';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  is_read: boolean;
  created_at: string;
}

interface AlertsProps extends PageProps {
  auth: {
    user: User;
  };
  devices: Device[];
  alerts: Alert[];
}

export default function Alerts({ auth, devices, alerts: initialAlerts }: AlertsProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDevice(devices[0]);
    }
  }, [devices]);

  const handleMarkAsRead = async (alertId: number) => {
    setIsLoading(true);
    try {
      await axios.post(route('parent.alerts.mark-read', alertId));
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      await axios.post(route('parent.alerts.mark-all-read'));
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => ({ ...alert, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = async (alertId: number) => {
    setIsLoading(true);
    try {
      await axios.delete(route('parent.alerts.dismiss', alertId));
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== alertId)
      );
    } catch (error) {
      console.error('Error dismissing alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAlerts = alerts
    .filter((alert) => !selectedDevice || alert.device_id === selectedDevice.id)
    .filter((alert) => filter === 'all' || !alert.is_read);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'cry':
        return BellIcon;
      case 'temperature':
      case 'humidity':
        return ExclamationTriangleIcon;
      default:
        return BellIcon;
    }
  };

  return (
    <ParentLayout user={auth.user}>
      <Head title="Alerts & Notifications" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Device Selection */}
          {devices.length > 1 && (
            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
              <div className="max-w-xl">
                <h2 className="text-lg font-medium text-gray-900">Select Device</h2>
                <div className="mt-4">
                  <select
                    value={selectedDevice?.id}
                    onChange={(e) => {
                      const device = devices.find(d => d.id === Number(e.target.value));
                      setSelectedDevice(device || null);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">All Devices</option>
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Alerts List */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                  </select>
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={isLoading || !filteredAlerts.some(alert => !alert.is_read)}
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Mark All as Read
                  </button>
                </div>
              </div>

              <div className="mt-6">
                {filteredAlerts.length > 0 ? (
                  <ul role="list" className="divide-y divide-gray-200">
                    {filteredAlerts.map((alert) => {
                      const Icon = getAlertIcon(alert.type);
                      return (
                        <li key={alert.id} className="relative py-5">
                          <div className="flex items-start space-x-4 px-4">
                            <div className={`rounded-full p-2 ${getSeverityColor(alert.severity)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {devices.find(d => d.id === alert.device_id)?.name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {alert.message}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-500">
                                    {new Date(alert.created_at).toLocaleString()}
                                  </span>
                                  {!alert.is_read && (
                                    <button
                                      onClick={() => handleMarkAsRead(alert.id)}
                                      disabled={isLoading}
                                      className="rounded-full bg-green-100 p-1 text-green-600 hover:bg-green-200"
                                    >
                                      <CheckCircleIcon className="h-5 w-5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDismissAlert(alert.id)}
                                    disabled={isLoading}
                                    className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                                  >
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              {!alert.is_read && (
                                <div className="absolute right-0 top-5 h-2 w-2 rounded-full bg-blue-600" />
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're all caught up! No new notifications at this time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
} 