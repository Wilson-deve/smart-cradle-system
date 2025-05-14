import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

interface Log {
  id: number;
  type: string;
  message: string;
  user?: {
    name: string;
  };
  device?: {
    name: string;
  };
  created_at: string;
}

interface Props {
  logs: {
    data: Log[];
    current_page: number;
    last_page: number;
  };
}

export default function SystemLogs({ logs }: Props) {
  const [filter, setFilter] = useState('all');

  return (
    <AdminLayout>
      <Head title="System Logs" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">
                    System Logs
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all system activities and events.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="all">All Logs</option>
                    <option value="auth">Authentication</option>
                    <option value="device">Device</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Message
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            User
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Device
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {logs.data.map((log) => (
                          <tr key={log.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  log.type === 'error'
                                    ? 'bg-red-100 text-red-800'
                                    : log.type === 'warning'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {log.type}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {log.message}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {log.user?.name || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {log.device?.name || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(
                                new Date(log.created_at),
                                'MMM d, yyyy HH:mm',
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {logs.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      disabled={logs.current_page === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      disabled={logs.current_page === logs.last_page}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
