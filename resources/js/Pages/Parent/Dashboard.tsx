import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ParentLayout from '../../Layouts/ParentLayout';

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
  babysitters: Array<{
    id: number;
    name: string;
    email: string;
    status: string;
    last_active: string;
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

export default function Dashboard({
  devices,
  babysitters,
  alerts,
  health_metrics,
}: Props) {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.id);
  const [newBabysitterEmail, setNewBabysitterEmail] = useState('');
  const [showAddBabysitter, setShowAddBabysitter] = useState(false);

  const toggleControl = (deviceId: number, control: 'swing' | 'lullaby') => {
    router.patch(route('parent.devices.controls.toggle', deviceId), {
      control,
    });
  };

  const addBabysitter = () => {
    router.post(
      route('parent.babysitters.store'),
      {
        email: newBabysitterEmail,
      },
      {
        onSuccess: () => {
          setNewBabysitterEmail('');
          setShowAddBabysitter(false);
        },
      },
    );
  };

  const removeBabysitter = (babysitterId: number) => {
    router.delete(route('parent.babysitters.destroy', babysitterId));
  };

  return (
    <ParentLayout>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Live Monitoring Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Camera Feed */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Live Camera Feed
                  </h2>
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200">
                    <span className="text-gray-500">
                      Camera feed will be displayed here
                    </span>
                  </div>
                </div>
              </div>

              {/* Sensor Readings */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Sensor Readings
                  </h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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

              {/* Controls */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Cradle Controls
                  </h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleControl(selectedDevice!, 'swing')}
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
                      onClick={() => toggleControl(selectedDevice!, 'lullaby')}
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
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Alerts */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Alerts & Notifications
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

              {/* Babysitters */}
              <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Babysitters
                    </h2>
                    <button
                      onClick={() => setShowAddBabysitter(true)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {babysitters.map((babysitter) => (
                      <div
                        key={babysitter.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{babysitter.name}</p>
                          <p className="text-sm text-gray-500">
                            {babysitter.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Last active: {babysitter.last_active}
                          </p>
                        </div>
                        <button
                          onClick={() => removeBabysitter(babysitter.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
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

      {/* Add Babysitter Modal */}
      {showAddBabysitter && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Add New Babysitter
            </h3>
            <input
              type="email"
              value={newBabysitterEmail}
              onChange={(e) => setNewBabysitterEmail(e.target.value)}
              placeholder="Enter babysitter's email"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowAddBabysitter(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addBabysitter}
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </ParentLayout>
  );
}
