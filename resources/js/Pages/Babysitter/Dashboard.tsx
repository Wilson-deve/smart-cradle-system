import { useEffect, useState } from 'react';
import BabysitterLayout from '@/Layouts/BabysitterLayout';
import { Head } from '@inertiajs/react';
import axios from '@/lib/axios';
import {
  BellIcon,
  CameraIcon,
  MusicalNoteIcon,
  SparklesIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { toast } from '@/Components/ui/use-toast';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Switch } from '@/Components/ui/switch';

interface Baby {
  id: number;
  name: string;
  age: string;
  status: {
    sleeping: boolean;
    crying: boolean;
    active: boolean;
  };
  sensors: {
    temperature: number;
    humidity: number;
    noise_level: number;
    motion_detected: boolean;
  };
  device: {
    id: number;
    swing_status: boolean;
    lullaby_playing: boolean;
    projector_on: boolean;
    current_lullaby?: string;
    swing_speed: number;
  };
  parent_contact: {
    name: string;
    phone: string;
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
}

export default function Dashboard({ auth }: Props) {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBabyData = async () => {
    try {
      const response = await axios.get('/api/babysitter/dashboard');
      setBabies(response.data.assigned_babies);
      if (response.data.assigned_babies.length > 0 && !selectedBaby) {
        setSelectedBaby(response.data.assigned_babies[0]);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch baby data');
      toast({
        title: 'Error',
        description: 'Failed to fetch baby data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBabyData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchBabyData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSwingControl = async (deviceId: number, action: 'start' | 'stop', speed?: number) => {
    try {
      await axios.post(`/api/babysitter/cradle/${deviceId}/swing`, {
        action,
        speed,
      });
      await fetchBabyData();
      toast({
        title: 'Success',
        description: `Swing ${action}ed successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to control swing',
        variant: 'destructive',
      });
    }
  };

  const handleLullabyControl = async (deviceId: number, action: 'play' | 'stop', lullabyId?: string) => {
    try {
      await axios.post(`/api/babysitter/cradle/${deviceId}/lullaby`, {
        action,
        lullaby_id: lullabyId,
        volume: 50, // Default volume
      });
      await fetchBabyData();
      toast({
        title: 'Success',
        description: `Lullaby ${action}ed successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to control lullaby',
        variant: 'destructive',
      });
    }
  };

  const handleProjectorControl = async (deviceId: number, action: 'on' | 'off') => {
    try {
      await axios.post(`/api/babysitter/cradle/${deviceId}/projector`, {
        action,
        brightness: 70, // Default brightness
      });
      await fetchBabyData();
      toast({
        title: 'Success',
        description: `Projector turned ${action} successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to control projector',
        variant: 'destructive',
      });
    }
  };

  return (
    <BabysitterLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Baby Selection */}
              <div className="flex space-x-4">
                {babies.map((baby) => (
                  <button
                    key={baby.id}
                    onClick={() => setSelectedBaby(baby)}
                    className={`rounded-lg p-4 ${
                      selectedBaby?.id === baby.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{baby.name}</div>
                    <div className="text-sm text-gray-500">{baby.age}</div>
                  </button>
                ))}
              </div>

              {selectedBaby && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Live Camera Feed */}
                  <Card className="col-span-2">
                    <div className="p-6">
                      <h3 className="flex items-center text-lg font-medium">
                        <VideoCameraIcon className="mr-2 h-5 w-5" />
                        Live Camera Feed
                      </h3>
                      <div className="mt-4 aspect-video rounded-lg bg-gray-100">
                        {/* Camera feed component will be implemented here */}
                        <div className="flex h-full items-center justify-center">
                          Live camera feed placeholder
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Baby Status */}
                  <Card>
                    <div className="p-6">
                      <h3 className="mb-4 text-lg font-medium">Baby Status</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="text-sm text-gray-500">Temperature</div>
                            <div className="text-2xl font-semibold">
                              {selectedBaby.sensors.temperature}°C
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="text-sm text-gray-500">Humidity</div>
                            <div className="text-2xl font-semibold">
                              {selectedBaby.sensors.humidity}%
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4">
                          <div className="text-sm text-gray-500">Status</div>
                          <div className="mt-1 space-x-2">
                            {selectedBaby.status.sleeping && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Sleeping
                              </span>
                            )}
                            {selectedBaby.status.crying && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Crying
                              </span>
                            )}
                            {selectedBaby.status.active && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Cradle Controls */}
                  <Card>
                    <div className="p-6">
                      <h3 className="mb-4 text-lg font-medium">Cradle Controls</h3>
                      <div className="space-y-6">
                        {/* Swing Control */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-blue-100 p-2">
                              <svg
                                className="text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Swing</div>
                              <div className="text-sm text-gray-500">
                                {selectedBaby.device.swing_status
                                  ? `Speed: ${selectedBaby.device.swing_speed}`
                                  : 'Stopped'}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={selectedBaby.device.swing_status}
                            onCheckedChange={(checked) =>
                              handleSwingControl(
                                selectedBaby.device.id,
                                checked ? 'start' : 'stop',
                                checked ? 3 : undefined,
                              )
                            }
                          />
                        </div>

                        {/* Lullaby Control */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-purple-100 p-2">
                              <MusicalNoteIcon className="text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">Lullaby</div>
                              <div className="text-sm text-gray-500">
                                {selectedBaby.device.lullaby_playing
                                  ? selectedBaby.device.current_lullaby
                                  : 'Not playing'}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={selectedBaby.device.lullaby_playing}
                            onCheckedChange={(checked) =>
                              handleLullabyControl(
                                selectedBaby.device.id,
                                checked ? 'play' : 'stop',
                                checked ? '1' : undefined,
                              )
                            }
                          />
                        </div>

                        {/* Projector Control */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-yellow-100 p-2">
                              <SparklesIcon className="text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-medium">Projector</div>
                              <div className="text-sm text-gray-500">
                                {selectedBaby.device.projector_on
                                  ? 'On'
                                  : 'Off'}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={selectedBaby.device.projector_on}
                            onCheckedChange={(checked) =>
                              handleProjectorControl(
                                selectedBaby.device.id,
                                checked ? 'on' : 'off',
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BabysitterLayout>
  );
}
