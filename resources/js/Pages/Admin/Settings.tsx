import AdminLayout from '@/Layouts/AdminLayout';
import {
  BellIcon,
  CogIcon,
  CloudIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

interface Settings {
  system: {
    data_retention: string;
    session_timeout: string;
    two_factor_auth: string;
  };
  cloud: {
    api_endpoint: string;
    api_key: string;
    sync_interval: string;
    storage_limit: string;
  };
  notifications: {
    email_notifications: string;
    push_notifications: string;
    alert_threshold: string;
    notification_channels: string[];
  };
  monitoring: {
    camera_quality: string;
    stream_retention: string;
    sensor_polling_rate: string;
  };
  security: {
    password_policy: string;
    ip_whitelist: string[];
    max_login_attempts: number;
  };
}

interface Props {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      permissions: string[];
    };
  };
  settings: Settings;
}

export default function Settings({ auth, settings }: Props) {
  const [activeTab, setActiveTab] = useState('system');
  const [formData, setFormData] = useState<Settings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'system', name: 'System Settings', icon: CogIcon },
    { id: 'cloud', name: 'Cloud Settings', icon: CloudIcon },
    { id: 'security', name: 'Security Settings', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notification Settings', icon: BellIcon },
    { id: 'monitoring', name: 'Monitoring Settings', icon: VideoCameraIcon },
  ];

  const handleInputChange = (category: keyof Settings, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await axios.post('/admin/settings', formData);
      // Show success message
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="Settings" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              System Configuration
            </h2>
                          <Link
                href={route('admin.logs.index')}
                className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                View System Logs
              </Link>
          </div>

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
                      }`}
                    >
                      <tab.icon
                        className={`-ml-0.5 mr-2 h-5 w-5 ${
                          activeTab === tab.id
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="mt-6">
                {/* System Settings */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="data_retention" className="block text-sm font-medium text-gray-700">
                          Data Retention Period
                        </label>
                        <select
                          id="data_retention"
                          value={formData.system.data_retention}
                          onChange={(e) => handleInputChange('system', 'data_retention', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="30 days">30 days</option>
                          <option value="60 days">60 days</option>
                          <option value="90 days">90 days</option>
                          <option value="180 days">180 days</option>
                          <option value="365 days">365 days</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="session_timeout" className="block text-sm font-medium text-gray-700">
                          Session Timeout
                        </label>
                        <select
                          id="session_timeout"
                          value={formData.system.session_timeout}
                          onChange={(e) => handleInputChange('system', 'session_timeout', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="15 minutes">15 minutes</option>
                          <option value="30 minutes">30 minutes</option>
                          <option value="1 hour">1 hour</option>
                          <option value="2 hours">2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cloud Settings */}
                {activeTab === 'cloud' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Cloud Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="api_endpoint" className="block text-sm font-medium text-gray-700">
                          API Endpoint
                        </label>
                        <input
                          type="text"
                          id="api_endpoint"
                          value={formData.cloud.api_endpoint}
                          onChange={(e) => handleInputChange('cloud', 'api_endpoint', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">
                          API Key
                        </label>
                        <input
                          type="password"
                          id="api_key"
                          value={formData.cloud.api_key}
                          onChange={(e) => handleInputChange('cloud', 'api_key', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="sync_interval" className="block text-sm font-medium text-gray-700">
                          Sync Interval
                        </label>
                        <select
                          id="sync_interval"
                          value={formData.cloud.sync_interval}
                          onChange={(e) => handleInputChange('cloud', 'sync_interval', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="1 minute">1 minute</option>
                          <option value="5 minutes">5 minutes</option>
                          <option value="15 minutes">15 minutes</option>
                          <option value="30 minutes">30 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="password_policy" className="block text-sm font-medium text-gray-700">
                          Password Policy
                        </label>
                        <select
                          id="password_policy"
                          value={formData.security.password_policy}
                          onChange={(e) => handleInputChange('security', 'password_policy', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="basic">Basic</option>
                          <option value="medium">Medium</option>
                          <option value="strong">Strong</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="max_login_attempts" className="block text-sm font-medium text-gray-700">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          id="max_login_attempts"
                          min="1"
                          max="10"
                          value={formData.security.max_login_attempts}
                          onChange={(e) => handleInputChange('security', 'max_login_attempts', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="email_notifications" className="block text-sm font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <select
                          id="email_notifications"
                          value={formData.notifications.email_notifications}
                          onChange={(e) => handleInputChange('notifications', 'email_notifications', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="all">All Alerts</option>
                          <option value="important">Important Only</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="alert_threshold" className="block text-sm font-medium text-gray-700">
                          Alert Threshold
                        </label>
                        <select
                          id="alert_threshold"
                          value={formData.notifications.alert_threshold}
                          onChange={(e) => handleInputChange('notifications', 'alert_threshold', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Monitoring Settings */}
                {activeTab === 'monitoring' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Monitoring Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="camera_quality" className="block text-sm font-medium text-gray-700">
                          Camera Quality
                        </label>
                        <select
                          id="camera_quality"
                          value={formData.monitoring.camera_quality}
                          onChange={(e) => handleInputChange('monitoring', 'camera_quality', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="low">Low (480p)</option>
                          <option value="medium">Medium (720p)</option>
                          <option value="high">High (1080p)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="stream_retention" className="block text-sm font-medium text-gray-700">
                          Stream Retention
                        </label>
                        <select
                          id="stream_retention"
                          value={formData.monitoring.stream_retention}
                          onChange={(e) => handleInputChange('monitoring', 'stream_retention', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="12 hours">12 hours</option>
                          <option value="24 hours">24 hours</option>
                          <option value="48 hours">48 hours</option>
                          <option value="72 hours">72 hours</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="sensor_polling_rate" className="block text-sm font-medium text-gray-700">
                          Sensor Polling Rate
                        </label>
                        <select
                          id="sensor_polling_rate"
                          value={formData.monitoring.sensor_polling_rate}
                          onChange={(e) => handleInputChange('monitoring', 'sensor_polling_rate', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="1 second">1 second</option>
                          <option value="5 seconds">5 seconds</option>
                          <option value="10 seconds">10 seconds</option>
                          <option value="30 seconds">30 seconds</option>
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
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
