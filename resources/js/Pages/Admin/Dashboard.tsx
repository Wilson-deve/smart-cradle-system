import AdminLayout from '@/Layouts/AdminLayout';
import {
  ChartBarIcon,
  DevicePhoneMobileIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Stats {
  users: number;
  devices: number;
  activeDevices: number;
}

interface Props extends PageProps {
  stats: Stats;
}

export default function Dashboard({ auth, stats }: Props) {
  // If no auth data, show loading state
  if (!auth?.user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.users,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Devices',
      value: stats.devices,
      icon: DevicePhoneMobileIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Active Devices',
      value: stats.activeDevices,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <AdminLayout user={auth.user}>
      <Head title="Admin Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">
            Dashboard Overview
          </h1>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon
                        className={`h-6 w-6 rounded p-1 text-white ${stat.color}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {stat.name}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-4 shadow hover:bg-gray-50">
                <h3 className="text-base font-medium text-gray-900">
                  User Management
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add, edit, or remove users and manage their roles
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow hover:bg-gray-50">
                <h3 className="text-base font-medium text-gray-900">
                  Device Management
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor and manage connected devices
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow hover:bg-gray-50">
                <h3 className="text-base font-medium text-gray-900">
                  System Health
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View system metrics and performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
