import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps } from '@/types';
import axios from '@/lib/axios';
import {
  ChartBarIcon,
  VideoCameraIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { User } from '@/types/models';

interface Device {
  id: number;
  name: string;
  status: string;
  last_activity_at: string;
  sensor_readings?: {
    temperature?: number;
    humidity?: number;
    noise_level?: number;
    light_level?: number;
    movement_detected?: boolean;
    wetness_detected?: boolean;
    timestamp?: string;
  };
}

interface SensorData {
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

interface MonitoringProps extends PageProps {
  auth: {
    user: User;
  };
  devices: Device[];
}

export default function Monitoring({ auth, devices }: MonitoringProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<SensorData['sensor_data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraFeed, setCameraFeed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0]);
    }
  }, [devices]);

  useEffect(() => {
    if (selectedDevice) {
      fetchData();
      // Only set up polling if we haven't had too many consecutive errors
      if (retryCount < 3) {
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
      }
    }
  }, [selectedDevice, retryCount]);

  const fetchData = async () => {
    if (!selectedDevice) return;

    setIsLoading(true);
    setError(null);

    try {
      const [sensorResponse, cameraResponse] = await Promise.all([
        axios.get<SensorData>(route('parent.monitoring.data', selectedDevice.id)),
        axios.get<{ stream_url: string }>(route('parent.monitoring.camera', selectedDevice.id)),
      ]);

      setSensorData(sensorResponse.data.sensor_data);
      setCameraFeed(cameraResponse.data.stream_url);
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Error fetching monitoring data:', error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        setError('You do not have permission to access this device\'s data.');
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please refresh the page to log in again.');
      } else if (error.response?.status === 404) {
        setError('Device not found or has been removed.');
      } else {
        setError('Failed to fetch monitoring data. Please try again.');
      }

      // Clear data on error
      setSensorData(null);
      setCameraFeed(null);
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

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
    <ParentLayout user={auth.user}>
      <Head title="Live Monitoring" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Error display */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>{error}</p>
              <RetryButton />
            </div>
          )}

          {/* Device Selection */}
          {devices.length > 1 && (
            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
              <div className="max-w-xl">
                <h2 className="text-lg font-medium text-gray-900">Select Device</h2>
                <div className="mt-4">
                  <select
                    value={selectedDevice?.id}
                    onChange={(e) => {
                      const device = devices.find(d => d.id === Number(e.target.value));
                      setSelectedDevice(device || null);
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

          {selectedDevice && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Camera Feed */}
              <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Live Camera Feed</h2>
                  <button
                    onClick={fetchData}
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Refresh
                  </button>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {cameraFeed ? (
                    <img
                      src={cameraFeed}
                      alt="Live Camera Feed"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                      <p className="ml-2 text-gray-500">Loading camera feed...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sensor Data */}
              <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Sensor Data</h2>
                  <span className="text-sm text-gray-500">
                    Last updated: {sensorData?.timestamp ? new Date(sensorData.timestamp).toLocaleString() : 'Never'}
                  </span>
                </div>
                {sensorData ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Temperature</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">
                        {sensorData.temperature}°C
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Humidity</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">
                        {sensorData.humidity}%
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Noise Level</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">
                        {sensorData.noise_level} dB
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Motion Status</h3>
                      <p className={`mt-2 text-lg font-semibold ${
                        sensorData.movement_detected ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {sensorData.movement_detected ? 'Movement Detected' : 'No Movement'}
                      </p>
                    </div>
                    <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Wetness Status</h3>
                      <p className={`mt-2 text-lg font-semibold ${
                        sensorData.wetness_detected ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {sensorData.wetness_detected ? 'Wetness Detected' : 'Normal'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <ChartBarIcon className="h-12 w-12 text-gray-400" />
                    <p className="ml-2 text-gray-500">Loading sensor data...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
} 