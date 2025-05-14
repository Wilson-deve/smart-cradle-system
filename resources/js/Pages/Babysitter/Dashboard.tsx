import BabysitterLayout from '@/Layouts/BabysitterLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  devices: Array<{
    id: number;
    name: string;
    status: string;
    last_reading: {
      temperature: number;
      humidity: number;
      sound_level: number;
      motion: boolean;
    };
    controls: {
      swing: boolean;
      lullaby: boolean;
    };
  }>;
  alerts: Array<{
    id: number;
    type: string;
    message: string;
    severity: string;
    created_at: string;
  }>;
  health_metrics: {
    average_temperature: number;
    average_humidity: number;
    crying_episodes: number;
    last_crying_episode: string;
  };
}

export default function Dashboard({ devices, alerts, health_metrics }: Props) {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.id);

  const toggleControl = (deviceId: number, control: 'swing' | 'lullaby') => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    router.patch(route('babysitter.devices.controls.toggle', deviceId), {
      control,
      enabled: !device.controls[control],
    });
  };

  return (
    <BabysitterLayout>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Device Selection */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Select Device
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {devices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => setSelectedDevice(device.id)}
                        className={`rounded-lg border p-4 ${
                          selectedDevice === device.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-gray-500">
                          Status: {device.status}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Monitoring */}
              {selectedDevice && (
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                      Live Monitoring
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Temperature</p>
                        <p className="text-2xl font-semibold">
                          {
                            devices.find((d) => d.id === selectedDevice)
                              ?.last_reading.temperature
                          }
                          °C
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Humidity</p>
                        <p className="text-2xl font-semibold">
                          {
                            devices.find((d) => d.id === selectedDevice)
                              ?.last_reading.humidity
                          }
                          %
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Sound Level</p>
                        <p className="text-2xl font-semibold">
                          {
                            devices.find((d) => d.id === selectedDevice)
                              ?.last_reading.sound_level
                          }
                          dB
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Motion</p>
                        <p className="text-2xl font-semibold">
                          {devices.find((d) => d.id === selectedDevice)
                            ?.last_reading.motion
                            ? 'Detected'
                            : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              {selectedDevice && (
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                      Cradle Controls
                    </h2>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => toggleControl(selectedDevice, 'swing')}
                        className={`rounded-md px-4 py-2 ${
                          devices.find((d) => d.id === selectedDevice)?.controls
                            .swing
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Toggle Swing
                      </button>
                      <button
                        onClick={() => toggleControl(selectedDevice, 'lullaby')}
                        className={`rounded-md px-4 py-2 ${
                          devices.find((d) => d.id === selectedDevice)?.controls
                            .lullaby
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Toggle Lullaby
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Alerts */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Recent Alerts
                  </h2>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`rounded-lg p-4 ${
                          alert.severity === 'high'
                            ? 'bg-red-50 text-red-700'
                            : alert.severity === 'medium'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm opacity-75">{alert.created_at}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Health Overview */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Health Overview
                  </h2>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Average Temperature
                      </p>
                      <p className="text-2xl font-semibold">
                        {health_metrics.average_temperature}°C
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Average Humidity</p>
                      <p className="text-2xl font-semibold">
                        {health_metrics.average_humidity}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Crying Episodes (Today)
                      </p>
                      <p className="text-2xl font-semibold">
                        {health_metrics.crying_episodes}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last episode: {health_metrics.last_crying_episode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BabysitterLayout>
  );
}
