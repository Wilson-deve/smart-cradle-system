import AdminLayout from '@/Layouts/AdminLayout';
import {
  ChartBarIcon,
  DevicePhoneMobileIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Device {
  id: number;
  name: string;
  status: string;
  last_activity: string;
}

interface DeviceData {
  [key: string]: string | number | boolean;
}

interface HealthData {
  [category: string]: {
    [key: string]: string | number | boolean;
  };
}

interface MonitoringProps {
  devices: Device[];
}

const Monitoring: React.FC<MonitoringProps> = ({ devices }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [cameraFeed, setCameraFeed] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  useEffect(() => {
    if (selectedDevice) {
      // Fetch device data
      const fetchDeviceData = async () => {
        try {
          const response = await axios.get(
            `/api/monitoring/devices/${selectedDevice.id}/data`,
          );
          setDeviceData(response.data);
        } catch (error) {
          console.error('Error fetching device data:', error);
        }
      };

      // Fetch camera feed
      const fetchCameraFeed = async () => {
        try {
          const response = await axios.get(
            `/api/monitoring/devices/${selectedDevice.id}/camera`,
          );
          setCameraFeed(response.data.stream_url);
        } catch (error) {
          console.error('Error fetching camera feed:', error);
        }
      };

      // Fetch health analytics
      const fetchHealthData = async () => {
        try {
          const response = await axios.get(
            `/api/monitoring/devices/${selectedDevice.id}/health`,
          );
          setHealthData(response.data);
        } catch (error) {
          console.error('Error fetching health data:', error);
        }
      };

      fetchDeviceData();
      fetchCameraFeed();
      fetchHealthData();

      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchDeviceData();
        fetchHealthData();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedDevice]);

  return (
    <AdminLayout>
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
                              {new Date(device.last_activity).toLocaleString()}
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
                      {cameraFeed ? (
                        <img
                          src={cameraFeed}
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
                          {Object.entries(deviceData).map(([key, value]) => (
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
                          {Object.entries(healthData).map(
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
    </AdminLayout>
  );
};

export default Monitoring;
