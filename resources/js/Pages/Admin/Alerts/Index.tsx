import AdminLayout from '@/Layouts/AdminLayout';
import { BellIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'active' | 'resolved';
  created_at: string;
  device?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

interface Props {
  alerts: Alert[];
}

export default function AlertsIndex({ alerts }: Props) {
  return (
    <AdminLayout>
      <Head title="Alerts & Notifications" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Alerts & Notifications
                </h2>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-4 ${
                      alert.type === 'error'
                        ? 'border-red-200 bg-red-50'
                        : alert.type === 'warning'
                          ? 'border-yellow-200 bg-yellow-50'
                          : alert.type === 'success'
                            ? 'border-green-200 bg-green-50'
                            : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <BellIcon
                          className={`h-6 w-6 ${
                            alert.type === 'error'
                              ? 'text-red-400'
                              : alert.type === 'warning'
                                ? 'text-yellow-400'
                                : alert.type === 'success'
                                  ? 'text-green-400'
                                  : 'text-blue-400'
                          }`}
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {alert.message}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm">
                          {alert.device && (
                            <span className="text-gray-500">
                              Device: {alert.device.name}
                            </span>
                          )}
                          {alert.user && (
                            <span className="text-gray-500">
                              User: {alert.user.name}
                            </span>
                          )}
                          <span className="text-gray-500">
                            {alert.created_at}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            alert.status === 'active'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
