import AdminLayout from '@/Layouts/AdminLayout';
import {
  BellIcon,
  CogIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

export default function Settings({ auth }: Props) {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', name: 'System Settings', icon: CogIcon },
    { id: 'security', name: 'Security Settings', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notification Settings', icon: BellIcon },
  ];

  return (
    <AdminLayout user={auth.user}>
      <Head title="Settings" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold leading-tight text-gray-800">
            Settings
          </h2>
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } `}
                    >
                      <tab.icon
                        className={`-ml-0.5 mr-2 h-5 w-5 ${
                          activeTab === tab.id
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        } `}
                        aria-hidden="true"
                      />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="mt-6">
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      System Settings
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="dataRetention"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Data Retention Period
                        </label>
                        <select
                          id="dataRetention"
                          name="dataRetention"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>180 days</option>
                          <option>365 days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Security Settings
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="sessionTimeout"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Session Timeout
                        </label>
                        <select
                          id="sessionTimeout"
                          name="sessionTimeout"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>2 hours</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="twoFactorAuth"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Two-Factor Authentication
                        </label>
                        <select
                          id="twoFactorAuth"
                          name="twoFactorAuth"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>Required</option>
                          <option>Optional</option>
                          <option>Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Notification Settings
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="emailNotifications"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Notifications
                        </label>
                        <select
                          id="emailNotifications"
                          name="emailNotifications"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>All Alerts</option>
                          <option>Critical Only</option>
                          <option>Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="pushNotifications"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Push Notifications
                        </label>
                        <select
                          id="pushNotifications"
                          name="pushNotifications"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>All Alerts</option>
                          <option>Critical Only</option>
                          <option>Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
