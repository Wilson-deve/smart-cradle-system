import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

interface AlertData {
  duration?: string;
  last_seen?: string;
  current_temp?: string;
  threshold?: string;
  sensor_id?: string;
  error_code?: string;
  battery_level?: string;
  estimated_time?: string;
  signal_strength?: string;
  connection_type?: string;
  used_space?: string;
  available?: string;
  current_version?: string;
  new_version?: string;
  sync_time?: string;
  records_synced?: number;
  maintenance_type?: string;
  scheduled_time?: string;
}

interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  data: AlertData | null;
  device: {
    id: number;
    name: string;
  } | null;
  read_at: string | null;
  created_at: string;
}

interface Props {
  alerts: {
    data: Alert[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function Alerts({ alerts }: Props) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<number | ''>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const alertTypes = ['critical', 'warning', 'info'];
  const devices = Array.from(
    new Set(alerts.data.map((alert) => alert.device?.id).filter(Boolean)),
  );

  const filteredAlerts = alerts.data.filter((alert) => {
    if (selectedType && alert.type !== selectedType) return false;
    if (selectedDevice && alert.device?.id !== selectedDevice) return false;
    if (showUnreadOnly && alert.read_at) return false;
    return true;
  });

  const markAsRead = async (alertId: number) => {
    // TODO: Implement mark as read functionality
    console.log('Mark as read:', alertId);
  };

  return (
    <AdminLayout>
      <Head title="System Alerts" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <select
                  className="rounded-md border-gray-300"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {alertTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded-md border-gray-300"
                  value={selectedDevice}
                  onChange={(e) =>
                    setSelectedDevice(
                      e.target.value ? Number(e.target.value) : '',
                    )
                  }
                >
                  <option value="">All Devices</option>
                  {devices.map((deviceId) => (
                    <option key={deviceId} value={deviceId}>
                      {
                        alerts.data.find(
                          (alert) => alert.device?.id === deviceId,
                        )?.device?.name
                      }
                    </option>
                  ))}
                </select>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Show unread only
                  </span>
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className={alert.read_at ? 'bg-gray-50' : ''}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {format(new Date(alert.created_at), 'PPpp')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              alert.type === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : alert.type === 'warning'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {alert.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {alert.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {alert.message}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {alert.data && (
                            <div className="space-y-1">
                              {Object.entries(alert.data).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="font-medium text-gray-700">
                                      {key}:
                                    </span>
                                    <span className="text-gray-600">
                                      {value}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {alert.device?.name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {alert.read_at ? 'Read' : 'Unread'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {!alert.read_at && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Mark as read
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  Showing {filteredAlerts.length} of {alerts.total} alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
