import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps } from '@/types';
import axios from 'axios';
import {
  MusicalNoteIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathRoundedSquareIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

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
  settings: {
    is_swinging: boolean;
    swing_speed: number;
    is_playing_music: boolean;
    is_projector_on: boolean;
    volume: number;
    selected_lullaby?: string;
  };
}

interface Lullaby {
  id: string;
  name: string;
  duration: string;
}

interface ControlsProps extends PageProps {
  auth: {
    user: User;
  };
  devices: Device[];
  lullabies: Lullaby[];
}

// Add default settings object
const defaultSettings = {
  is_swinging: false,
  swing_speed: 1,
  is_playing_music: false,
  is_projector_on: false,
  volume: 50,
  selected_lullaby: '',
};

export default function Controls({ auth, devices, lullabies }: ControlsProps) {
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(50);
  const [swingSpeed, setSwingSpeed] = useState(1);

  useEffect(() => {
    // Parent will only have one device
    if (devices.length > 0) {
      const parentDevice = devices[0];
      setDevice({
        ...parentDevice,
        settings: parentDevice.settings || defaultSettings,
      });
      if (parentDevice?.settings) {
        setVolume(parentDevice.settings.volume || 50);
        setSwingSpeed(parentDevice.settings.swing_speed || 1);
      }
    }
  }, [devices]);

  const handleDeviceControl = async (
    control: 'swing' | 'lullaby' | 'projector',
    value: boolean
  ) => {
    if (!device) return;

    setIsLoading(true);
    try {
      await axios.post(route(`parent.controls.${control}`, device.id), {
        value,
      });

      setDevice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          settings: {
            ...(prev.settings || {}),
            [control === 'swing' ? 'is_swinging' : control === 'lullaby' ? 'is_playing_music' : 'is_projector_on']: value,
          },
        };
      });
    } catch (error) {
      console.error(`Error controlling ${control}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeedChange = async (speed: number) => {
    if (!device) return;

    setIsLoading(true);
    try {
      await axios.post(route('parent.controls.swing.speed', device.id), {
        speed,
      });
      setSwingSpeed(speed);
      setDevice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          settings: {
            ...(prev.settings || {}),
            swing_speed: speed,
          },
        };
      });
    } catch (error) {
      console.error('Error changing swing speed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    if (!device) return;

    setVolume(newVolume);
    try {
      await axios.post(route('parent.media.volume', device.id), {
        volume: newVolume,
      });
      setDevice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          settings: {
            ...(prev.settings || {}),
            volume: newVolume,
          },
        };
      });
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  };

  const handleLullabySelect = async (lullabyId: string) => {
    if (!device) return;

    setIsLoading(true);
    try {
      await axios.post(route('parent.media.play', device.id), {
        lullaby_id: lullabyId,
      });
      setDevice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          settings: {
            ...(prev.settings || {}),
            is_playing_music: true,
            selected_lullaby: lullabyId,
          },
        };
      });
    } catch (error) {
      console.error('Error playing lullaby:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParentLayout user={auth.user}>
      <Head title="Cradle Controls" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {device ? (
            <>
              {/* Device Status */}
              <div className="bg-white shadow sm:rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{device.name}</h2>
                    <p className="text-sm text-gray-500">
                      Last activity: {new Date(device.last_activity_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      device.status === 'online'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Swing Controls */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">Swing Controls</h3>
                    <div className="mt-6 space-y-6">
                      <div>
                        <button
                          onClick={() => handleDeviceControl('swing', !(device.settings?.is_swinging ?? false))}
                          disabled={isLoading}
                          className={`w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium ${
                            device.settings?.is_swinging
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-2" />
                          {device.settings?.is_swinging ? 'Stop Swinging' : 'Start Swinging'}
                        </button>
                      </div>
                      <div>
                        <label htmlFor="swing-speed" className="block text-sm font-medium text-gray-700">
                          Swing Speed
                        </label>
                        <input
                          type="range"
                          id="swing-speed"
                          min="1"
                          max="5"
                          value={swingSpeed}
                          onChange={(e) => handleSpeedChange(Number(e.target.value))}
                          disabled={isLoading || !(device.settings?.is_swinging ?? false)}
                          className="mt-2 w-full"
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>Gentle</span>
                          <span>Medium</span>
                          <span>Fast</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lullaby Controls */}
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">Lullaby Controls</h3>
                    <div className="mt-6 space-y-6">
                      <div>
                        <button
                          onClick={() => handleDeviceControl('lullaby', !(device.settings?.is_playing_music ?? false))}
                          disabled={isLoading}
                          className={`w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium ${
                            device.settings?.is_playing_music
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {device.settings?.is_playing_music ? (
                            <SpeakerWaveIcon className="h-5 w-5 mr-2" />
                          ) : (
                            <SpeakerXMarkIcon className="h-5 w-5 mr-2" />
                          )}
                          {device.settings?.is_playing_music ? 'Stop Music' : 'Play Music'}
                        </button>
                      </div>
                      <div>
                        <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                          Volume
                        </label>
                        <input
                          type="range"
                          id="volume"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          disabled={isLoading || !(device.settings?.is_playing_music ?? false)}
                          className="mt-2 w-full"
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>Quiet</span>
                          <span>Medium</span>
                          <span>Loud</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lullaby" className="block text-sm font-medium text-gray-700">
                          Select Lullaby
                        </label>
                        <select
                          id="lullaby"
                          value={device.settings?.selected_lullaby ?? ''}
                          onChange={(e) => handleLullabySelect(e.target.value)}
                          disabled={isLoading || !(device.settings?.is_playing_music ?? false)}
                          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Choose a lullaby...</option>
                          {lullabies.map((lullaby) => (
                            <option key={lullaby.id} value={lullaby.id}>
                              {lullaby.name} ({lullaby.duration})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projector Controls */}
                <div className="lg:col-span-2 bg-white shadow sm:rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">Projector Controls</h3>
                    <div className="mt-6">
                      <button
                        onClick={() => handleDeviceControl('projector', !(device.settings?.is_projector_on ?? false))}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium ${
                          device.settings?.is_projector_on
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <LightBulbIcon className="h-5 w-5 mr-2" />
                        {device.settings?.is_projector_on ? 'Turn Off Projector' : 'Turn On Projector'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <p className="text-gray-500 text-center">No device assigned. Please contact support to set up your device.</p>
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
}
