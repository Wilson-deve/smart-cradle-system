import ParentLayout from '@/Layouts/ParentLayout';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';

interface Device {
  id: number;
  name: string;
  status: string;
  last_active: string;
  assigned_to?: {
    id: number;
    name: string;
  };
}

interface Props {
  devices: Device[];
}

export default function DevicesIndex({ devices }: Props) {
  return (
    <ParentLayout>
      <Head title="My Devices" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">My Devices</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Device Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {devices.map((device) => (
                      <tr key={device.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <DevicePhoneMobileIcon className="mr-2 h-5 w-5 text-gray-400" />
                            {device.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              device.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {device.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {device.last_active}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              // Handle edit action
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
