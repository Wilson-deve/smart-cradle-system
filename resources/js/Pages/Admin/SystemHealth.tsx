import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

interface HealthMetric {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  [key: string]: string | number | boolean;
}

interface SystemHealth {
  database: HealthMetric;
  storage: HealthMetric & {
    free_space: number;
    total_space: number;
    used_space: number;
  };
  api: HealthMetric;
}

interface Props {
  health: SystemHealth;
}

export default function SystemHealth({ health }: Props) {
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <Head title="System Health" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                System Health Overview
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Database Health */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Database
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(health.database.status)}`}
                    >
                      {health.database.status}
                    </span>
                    <p className="text-sm text-gray-600">
                      {health.database.message}
                    </p>
                  </div>
                </div>

                {/* Storage Health */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Storage
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(health.storage.status)}`}
                      >
                        {health.storage.status}
                      </span>
                      <p className="text-sm text-gray-600">
                        {health.storage.message}
                      </p>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-blue-600"
                        style={{
                          width: `${(health.storage.used_space / health.storage.total_space) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">
                          {formatBytes(health.storage.total_space)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Used</p>
                        <p className="font-medium">
                          {formatBytes(health.storage.used_space)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Free</p>
                        <p className="font-medium">
                          {formatBytes(health.storage.free_space)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Health */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    API
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(health.api.status)}`}
                    >
                      {health.api.status}
                    </span>
                    <p className="text-sm text-gray-600">
                      {health.api.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {health.storage.status === 'warning' && (
                    <li className="text-yellow-600">
                      • Consider cleaning up unused files or expanding storage
                      capacity
                    </li>
                  )}
                  {health.database.status === 'warning' && (
                    <li className="text-yellow-600">
                      • Monitor database performance and consider optimization
                    </li>
                  )}
                  {health.api.status === 'warning' && (
                    <li className="text-yellow-600">
                      • Check API endpoints for potential issues or rate
                      limiting
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
