import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  created_at: string;
  read_at: string | null;
}

interface Props extends PageProps {
  alerts: Alert[];
}

export default function Alerts({ auth, alerts = [] }: Props) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);

  const markAsRead = async (alertId: number) => {
    try {
      await axios.post(`/admin/alerts/${alertId}/read`);
      setLocalAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, read_at: new Date().toISOString() }
            : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="Alerts & Notifications" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Alerts & Notifications
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">
                    View and manage system alerts and notifications.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {localAlerts.length > 0 ? (
                  <div className="flow-root">
                    <ul role="list" className="-mb-8">
                      {localAlerts.map((alert, alertIdx) => (
                        <li key={alert.id}>
                          <div className="relative pb-8">
                            {alertIdx !== localAlerts.length - 1 ? (
                              <span
                                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div>
                                <div className={`relative px-1 ${
                                  alert.read_at ? 'text-gray-400' : 'text-blue-500'
                                }`}>
                                  <BellIcon className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">
                                      {alert.title}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500">
                                    {new Date(alert.created_at).toLocaleString()}
                                  </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                  <p>{alert.message}</p>
                                </div>
                                {!alert.read_at && (
                                  <div className="mt-2">
                                    <button
                                      type="button"
                                      onClick={() => markAsRead(alert.id)}
                                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                      <CheckCircleIcon className="mr-1.5 h-4 w-4" />
                                      Mark as read
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any notifications at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
