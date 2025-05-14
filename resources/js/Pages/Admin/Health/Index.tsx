import AdminLayout from '@/Layouts/AdminLayout';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';

interface HealthMetric {
  id: number;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  last_updated: string;
}

interface Props {
  metrics?: HealthMetric[];
}

export default function HealthIndex({ metrics = [] }: Props) {
  return (
    <AdminLayout>
      <Head title="Health Analytics" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Health Analytics</h2>
              </div>

              {metrics.length === 0 ? (
                <div className="text-center text-gray-500">
                  No health metrics available
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="rounded-lg bg-white p-6 shadow"
                    >
                      <div className="flex items-center">
                        <ChartBarIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-medium">{metric.name}</h3>
                      </div>
                      <div className="mt-4">
                        <p className="text-3xl font-bold">
                          {metric.value} {metric.unit}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              metric.trend === 'up'
                                ? 'bg-green-100 text-green-800'
                                : metric.trend === 'down'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {metric.trend === 'up'
                              ? '↑'
                              : metric.trend === 'down'
                                ? '↓'
                                : '→'}{' '}
                            {metric.trend}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            Last updated: {metric.last_updated}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
