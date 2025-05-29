import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Log {
  timestamp: string;
  level: string;
  channel: string;
  message: string;
}

interface LogsProps {
  logs: {
    data: Log[];
    total: number;
    per_page: number;
    current_page: number;
  };
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      permissions: string[];
    };
  };
}

export default function Logs({ logs, auth }: LogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  const levels = ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'];
  const channels = Array.from(new Set(logs?.data?.map(log => log.channel) || []));

  const filteredLogs = logs?.data?.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level.toLowerCase() === levelFilter;
    const matchesChannel = channelFilter === 'all' || log.channel === channelFilter;
    return matchesSearch && matchesLevel && matchesChannel;
  }) || [];

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      debug: 'bg-gray-100 text-gray-800',
      info: 'bg-blue-100 text-blue-800',
      notice: 'bg-purple-100 text-purple-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      critical: 'bg-red-100 text-red-800',
      alert: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800',
    };
    return colors[level.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const handleDownload = () => {
    window.location.href = route('logs.download');
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="System Logs" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                  System Logs
                </h2>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Download Logs
                </button>
              </div>

              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="search" className="sr-only">
                    Search logs
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Search logs..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="level" className="sr-only">
                    Filter by level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">All Levels</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="channel" className="sr-only">
                    Filter by channel
                  </label>
                  <select
                    id="channel"
                    name="channel"
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">All Channels</option>
                    {channels.map((channel) => (
                      <option key={channel} value={channel}>
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Channel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredLogs.map((log, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getLevelColor(
                              log.level
                            )}`}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {log.channel}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-2xl break-words">{log.message}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination info */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredLogs.length}</span> of{' '}
                    <span className="font-medium">{logs?.total || 0}</span> results
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{filteredLogs.length}</span> of{' '}
                      <span className="font-medium">{logs?.total || 0}</span> results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 