import AdminLayout from '@/Layouts/AdminLayout';
import {
  ChartBarIcon,
  DevicePhoneMobileIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import { PageProps } from '@/types';
import { User } from '@/types/models';

interface Device {
  id: number;
  name: string;
  status: string;
  last_activity_at: string;
}

interface DeviceData {
  sensor_data: {
    temperature: number;
    humidity: number;
    noise_level: number;
    movement_detected: boolean;
    wetness_detected: boolean;
    timestamp: string;
  };
  device_status: {
    status: string;
    last_activity_at: string;
    swing_status: boolean;
    music_status: boolean;
    projector_status: boolean;
  };
  recent_alerts: Array<{
    id: number;
    type: string;
    message: string;
    created_at: string;
  }>;
  usage_stats: {
    swing_time: number;
    music_playtime: number;
    projector_usage: number;
  };
}

interface CameraData {
  stream_url: string;
  status: string;
  last_frame: string | null;
  night_vision: boolean;
}

interface HealthData {
  health_metrics: {
    uptime: number;
    battery_health: number;
    sensor_health: Record<string, boolean>;
    network_health: {
      connected: boolean;
      signal_strength: number;
      latency: number;
      packet_loss: number;
    };
    maintenance_needed: Record<string, boolean | string | number>;
  };
  historical_data: {
    temperature_history: Record<string, number>;
    humidity_history: Record<string, number>;
    noise_history: Record<string, number>;
  };
}

interface MonitoringProps extends PageProps {
  auth: {
    user: User;
  };
  devices: Device[];
}

const Monitoring: React.FC<MonitoringProps> = ({ devices, auth }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [cameraData, setCameraData] = useState<CameraData | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if user has monitoring permission
  const hasMonitoringPermission = auth.user.permissions.includes('monitoring.view');

  const fetchData = async () => {
    if (!selectedDevice) return;
    
    if (!hasMonitoringPermission) {
      setError('You do not have permission to view monitoring data.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add error handling for each request individually
      const [deviceResponse, cameraResponse, healthResponse] = await Promise.allSettled([
        axios.get<DeviceData>(`/api/admin/monitoring/devices/${selectedDevice.id}/data`),
        axios.get<CameraData>(`/api/admin/monitoring/devices/${selectedDevice.id}/camera`),
        axios.get<HealthData>(`/api/admin/monitoring/devices/${selectedDevice.id}/health`)
      ]);

      // Handle responses individually
      if (deviceResponse.status === 'fulfilled') {
        setDeviceData(deviceResponse.value.data);
      } else {
        console.error('Error fetching device data:', deviceResponse.reason);
      }

      if (cameraResponse.status === 'fulfilled') {
        setCameraData(cameraResponse.value.data);
      } else {
        console.error('Error fetching camera data:', cameraResponse.reason);
      }

      if (healthResponse.status === 'fulfilled') {
        setHealthData(healthResponse.value.data);
      } else {
        console.error('Error fetching health data:', healthResponse.reason);
      }

      // Check if all requests failed
      if (deviceResponse.status === 'rejected' && 
          cameraResponse.status === 'rejected' && 
          healthResponse.status === 'rejected') {
        const error = deviceResponse.reason;
        if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError('Failed to fetch monitoring data. Please try again.');
        }
      }

      setRetryCount(0); // Reset retry count on any success
    } catch (err: any) {
      console.error('Error fetching monitoring data:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view monitoring data.');
      } else {
        setError('Failed to fetch monitoring data. Please try again.');
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      fetchData();
      
      // Set up polling for real-time updates
      // Only if we haven't had too many consecutive errors
      if (retryCount < 3) {
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [selectedDevice, retryCount]);

  // Reset device selection if devices list changes
  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0]);
    }
  }, [devices]);

  // Add retry button component
  const RetryButton = () => (
    <button
      onClick={() => {
        setRetryCount(0);
        fetchData();
      }}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Retry Connection
    </button>
  );

  return (
    <AdminLayout user={auth.user}>
      <div className="container mx-auto px-4 py-8">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
            <RetryButton />
          </div>
        )}

        <div className="space-y-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                Device Monitoring
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Monitor real-time data and camera feeds from all connected cradle
                devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Device List */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Connected Devices
                  </h3>
                  <div className="mt-6 flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {devices.map((device) => (
                        <li
                          key={device.id}
                          className={`cursor-pointer py-4 ${
                            selectedDevice?.id === device.id ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => setSelectedDevice(device)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <DevicePhoneMobileIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {device.name}
                              </p>
                              <p className="truncate text-sm text-gray-500">
                                Last activity:{' '}
                                {new Date(device.last_activity_at).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  device.status === 'online'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {device.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring Data */}
            <div className="lg:col-span-2">
              {selectedDevice ? (
                <div className="space-y-6">
                  {/* Camera Feed */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                        <h3 className="ml-2 text-lg font-medium leading-6 text-gray-900">
                          Camera Feed
                        </h3>
                      </div>
                      <div className="mt-4">
                        {cameraData ? (
                          <img
                            src={cameraData.stream_url}
                            alt="Camera Feed"
                            className="w-full rounded-lg"
                          />
                        ) : (
                          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                            <p className="text-gray-500">
                              Loading camera feed...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Device Data */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-6 w-6 text-gray-400" />
                        <h3 className="ml-2 text-lg font-medium leading-6 text-gray-900">
                          Device Data
                        </h3>
                      </div>
                      <div className="mt-4">
                        {deviceData ? (
                          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {Object.entries(deviceData.sensor_data).map(([key, value]) => (
                              <div
                                key={key}
                                className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6"
                              >
                                <dt className="truncate text-sm font-medium text-gray-500">
                                  {key.replace(/_/g, ' ').toUpperCase()}
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100">
                            <p className="text-gray-500">
                              Loading device data...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Health Analytics */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-6 w-6 text-gray-400" />
                        <h3 className="ml-2 text-lg font-medium leading-6 text-gray-900">
                          Health Analytics
                        </h3>
                      </div>
                      <div className="mt-4">
                        {healthData ? (
                          <div className="space-y-4">
                            {Object.entries(healthData.health_metrics).map(
                              ([category, data]) => {
                                const typedData = data as {
                                  [key: string]: string | number | boolean;
                                };
                                return (
                                  <div
                                    key={category}
                                    className="rounded-lg bg-gray-50 p-4"
                                  >
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {category.replace(/_/g, ' ').toUpperCase()}
                                    </h4>
                                    <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                      {Object.entries(typedData).map(
                                        ([key, value]) => {
                                          const typedValue = value as
                                            | string
                                            | number
                                            | boolean;
                                          return (
                                            <div
                                              key={key}
                                              className="flex justify-between"
                                            >
                                              <dt className="text-sm text-gray-500">
                                                {key}
                                              </dt>
                                              <dd className="text-sm font-medium text-gray-900">
                                                {typedValue}
                                              </dd>
                                            </div>
                                          );
                                        },
                                      )}
                                    </dl>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        ) : (
                          <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100">
                            <p className="text-gray-500">
                              Loading health data...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-96 items-center justify-center rounded-lg bg-white shadow">
                  <p className="text-gray-500">
                    Select a device to view monitoring data
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Monitoring;
