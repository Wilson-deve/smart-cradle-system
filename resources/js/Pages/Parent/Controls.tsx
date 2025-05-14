import RoleBasedLayout from '@/Layouts/RoleBasedLayout';
import { User } from '@/types/roles';
import { Switch } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface ControlsProps {
  auth: {
    user: User;
  };
  device: {
    id: number;
    name: string;
    status: {
      swingEnabled: boolean;
      swingSpeed: number;
      lullabyPlaying: boolean;
      projectorEnabled: boolean;
    };
  };
}

const Controls: React.FC<ControlsProps> = ({ auth, device }) => {
  const { user } = auth;
  const [swingSpeed, setSwingSpeed] = useState(device.status.swingSpeed);

  const { post } = useForm();

  const toggleSwing = () => {
    post(route('parent.controls.swing', { device: device.id }));
  };

  const updateSwingSpeed = (speed: number) => {
    setSwingSpeed(speed);
    post(route('parent.controls.swing.speed', { device: device.id }), {
      data: { speed },
    });
  };

  const toggleLullaby = () => {
    post(route('parent.controls.lullaby', { device: device.id }));
  };

  const toggleProjector = () => {
    post(route('parent.controls.projector', { device: device.id }));
  };

  return (
    <RoleBasedLayout user={user}>
      <Head title="Cradle Controls" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <h1 className="mb-4 text-2xl font-bold">Cradle Controls</h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold">Swing Controls</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Swing Mode</span>
                      <Switch
                        checked={device.status.swingEnabled}
                        onChange={toggleSwing}
                        className={`${
                          device.status.swingEnabled
                            ? 'bg-indigo-600'
                            : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Enable swing</span>
                        <span
                          className={`${
                            device.status.swingEnabled
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Swing Speed
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={swingSpeed}
                        onChange={(e) =>
                          updateSwingSpeed(Number(e.target.value))
                        }
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                        disabled={!device.status.swingEnabled}
                      />
                      <div className="mt-1 flex justify-between text-xs text-gray-600">
                        <span>Gentle</span>
                        <span>Medium</span>
                        <span>Fast</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-xl font-semibold">
                    Comfort Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Lullaby</span>
                      <Switch
                        checked={device.status.lullabyPlaying}
                        onChange={toggleLullaby}
                        className={`${
                          device.status.lullabyPlaying
                            ? 'bg-indigo-600'
                            : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Play lullaby</span>
                        <span
                          className={`${
                            device.status.lullabyPlaying
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Projector</span>
                      <Switch
                        checked={device.status.projectorEnabled}
                        onChange={toggleProjector}
                        className={`${
                          device.status.projectorEnabled
                            ? 'bg-indigo-600'
                            : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Enable projector</span>
                        <span
                          className={`${
                            device.status.projectorEnabled
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default Controls;
