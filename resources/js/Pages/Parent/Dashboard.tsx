import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  VideoCameraIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import ParentLayout from '@/Layouts/ParentLayout';
import axios from 'axios';
import { PageProps } from '@/types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface Device {
  id: number;
  name: string;
  status: string;
  last_activity_at: string;
  settings?: {
    is_swinging: boolean;
    swing_speed: number;
    is_playing_music: boolean;
    is_projector_on: boolean;
    volume: number;
  };
}

interface Alert {
  id: number;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

interface DashboardProps extends PageProps {
  auth: {
    user: User;
  };
  devices?: Device[];
  alerts?: Alert[];
  recent_activities?: Activity[];
}

const defaultSettings = {
  swing_speed: 1,
  is_swinging: false,
  is_playing_music: false,
  is_projector_on: false,
  volume: 50,
};

export default function Dashboard({ auth, devices = [], alerts = [], recent_activities = [] }: DashboardProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (devices && devices.length > 0) {
      const device = devices[0];
      setSelectedDevice({
        ...device,
        settings: device.settings || defaultSettings,
      });
    }
  }, [devices]);

  const handleDeviceControl = async (control: string, value: boolean | number) => {
    if (!selectedDevice) return;

    setIsLoading(true);
    try {
      await axios.patch(route('parent.devices.controls.toggle', selectedDevice.id), {
        control,
        value,
      });
      
      // Refresh device data
      const response = await axios.get(route('parent.devices.show', selectedDevice.id));
      const updatedDevice = response.data.device;
      setSelectedDevice({
        ...updatedDevice,
        settings: updatedDevice.settings || defaultSettings,
      });
    } catch (error) {
      console.error('Error controlling device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the settings with fallback to defaultSettings
  const deviceSettings = selectedDevice?.settings || defaultSettings;

  return (
    <ParentLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Device Selection */}
          {devices && devices.length > 1 && (
            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
              <div className="max-w-xl">
                <h2 className="text-lg font-medium text-gray-900">Select Device</h2>
                <div className="mt-4">
                  <select
                    value={selectedDevice?.id}
                    onChange={(e) => {
                      const device = devices.find(d => d.id === Number(e.target.value));
                      if (device) {
                        setSelectedDevice({
                          ...device,
                          settings: device.settings || defaultSettings,
                        });
                      } else {
                        setSelectedDevice(null);
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Status */}
          {selectedDevice && (
            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Device Status</h3>
                  <p className={`mt-2 text-xl font-semibold ${
                    selectedDevice.status === 'online' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Swing Status</h3>
                  <p className="mt-2 text-xl font-semibold">
                    {deviceSettings.is_swinging ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Lullaby</h3>
                  <p className="mt-2 text-xl font-semibold">
                    {deviceSettings.is_playing_music ? 'Playing' : 'Off'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Projector</h3>
                  <p className="mt-2 text-xl font-semibold">
                    {deviceSettings.is_projector_on ? 'On' : 'Off'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Alerts */}
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg ${
                      alert.is_read ? 'bg-gray-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{alert.type}</p>
                        <p className="text-sm text-gray-500">{alert.message}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent alerts</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recent_activities.length > 0 ? (
                recent_activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
