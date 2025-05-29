import { useEffect, useState } from 'react';
import BabysitterLayout from '@/Layouts/BabysitterLayout';
import { Head } from '@inertiajs/react';
import axios from '@/lib/axios';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { Slider } from '@/Components/ui/slider';
import { toast } from '@/Components/ui/use-toast';
import {
  MusicalNoteIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

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

interface Baby {
  id: number;
  name: string;
  age: string;
  device: {
    id: number;
    swing_status: boolean;
    swing_speed: number;
    lullaby_playing: boolean;
    current_lullaby?: string;
    lullaby_volume: number;
    projector_on: boolean;
    projector_brightness: number;
  };
  parent_settings: {
    allow_swing_control: boolean;
    allow_lullaby_control: boolean;
    allow_projector_control: boolean;
    max_swing_speed: number;
    max_volume: number;
    max_brightness: number;
  };
}

interface Lullaby {
  id: string;
  name: string;
  duration: string;
}

export default function Controls({ auth }: Props) {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [lullabies, setLullabies] = useState<Lullaby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [babiesResponse, lullabiesResponse] = await Promise.all([
        axios.get('/api/babysitter/controls'),
        axios.get('/api/babysitter/lullabies'),
      ]);

      setBabies(babiesResponse.data.assigned_babies);
      setLullabies(lullabiesResponse.data.lullabies);

      if (babiesResponse.data.assigned_babies.length > 0 && !selectedBaby) {
        setSelectedBaby(babiesResponse.data.assigned_babies[0]);
      }

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      toast({
        title: 'Error',
        description: 'Failed to fetch control data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSwingControl = async (
    deviceId: number,
    action: 'start' | 'stop',
    speed?: number,
  ) => {
    if (!selectedBaby?.parent_settings.allow_swing_control) {
      toast({
        title: 'Error',
        description: 'Swing control is not allowed by parent',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`/api/babysitter/cradle/${deviceId}/swing`, {
        action,
        speed,
      });
      await fetchData();
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

  const handleLullabyControl = async (
    deviceId: number,
    action: 'play' | 'stop',
    lullabyId?: string,
    volume?: number,
  ) => {
    if (!selectedBaby?.parent_settings.allow_lullaby_control) {
      toast({
        title: 'Error',
        description: 'Lullaby control is not allowed by parent',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`/api/babysitter/cradle/${deviceId}/lullaby`, {
        action,
        lullaby_id: lullabyId,
        volume,
      });
      await fetchData();
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

  const handleProjectorControl = async (
    deviceId: number,
    action: 'on' | 'off',
    brightness?: number,
  ) => {
    if (!selectedBaby?.parent_settings.allow_projector_control) {
      toast({
        title: 'Error',
        description: 'Projector control is not allowed by parent',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`/api/babysitter/cradle/${deviceId}/projector`, {
        action,
        brightness,
      });
      await fetchData();
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
      <Head title="Cradle Controls" />

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
                  {/* Swing Control */}
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center text-lg font-medium">
                          <ArrowPathIcon className="mr-2 h-5 w-5" />
                          Swing Control
                        </h3>
                        <Switch
                          checked={selectedBaby.device.swing_status}
                          onCheckedChange={(checked) =>
                            handleSwingControl(
                              selectedBaby.device.id,
                              checked ? 'start' : 'stop',
                              checked ? selectedBaby.device.swing_speed : undefined,
                            )
                          }
                          disabled={!selectedBaby.parent_settings.allow_swing_control}
                        />
                      </div>
                      {selectedBaby.parent_settings.allow_swing_control && (
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Speed</span>
                            <span className="text-sm font-medium">
                              {selectedBaby.device.swing_speed}
                            </span>
                          </div>
                          <Slider
                            value={[selectedBaby.device.swing_speed]}
                            min={1}
                            max={selectedBaby.parent_settings.max_swing_speed}
                            step={1}
                            onValueChange={(values: number[]) =>
                              handleSwingControl(selectedBaby.device.id, 'start', values[0])
                            }
                            disabled={!selectedBaby.device.swing_status}
                          />
                        </div>
                      )}
                      {!selectedBaby.parent_settings.allow_swing_control && (
                        <p className="mt-2 text-sm text-gray-500">
                          Swing control is not allowed by parent
                        </p>
                      )}
                    </div>
                  </Card>

                  {/* Lullaby Control */}
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center text-lg font-medium">
                          <MusicalNoteIcon className="mr-2 h-5 w-5" />
                          Lullaby Control
                        </h3>
                        <Switch
                          checked={selectedBaby.device.lullaby_playing}
                          onCheckedChange={(checked) =>
                            handleLullabyControl(
                              selectedBaby.device.id,
                              checked ? 'play' : 'stop',
                              checked ? lullabies[0]?.id : undefined,
                            )
                          }
                          disabled={!selectedBaby.parent_settings.allow_lullaby_control}
                        />
                      </div>
                      {selectedBaby.parent_settings.allow_lullaby_control && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="text-sm text-gray-500">
                              Select Lullaby
                            </label>
                            <select
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={selectedBaby.device.current_lullaby}
                              onChange={(e) =>
                                handleLullabyControl(
                                  selectedBaby.device.id,
                                  'play',
                                  e.target.value,
                                )
                              }
                              disabled={!selectedBaby.device.lullaby_playing}
                            >
                              {lullabies.map((lullaby) => (
                                <option key={lullaby.id} value={lullaby.id}>
                                  {lullaby.name} ({lullaby.duration})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm text-gray-500">Volume</span>
                              <span className="text-sm font-medium">
                                {selectedBaby.device.lullaby_volume}%
                              </span>
                            </div>
                            <Slider
                              value={[selectedBaby.device.lullaby_volume]}
                              min={0}
                              max={selectedBaby.parent_settings.max_volume}
                              step={5}
                              onValueChange={(values: number[]) =>
                                handleLullabyControl(
                                  selectedBaby.device.id,
                                  'play',
                                  selectedBaby.device.current_lullaby,
                                  values[0],
                                )
                              }
                              disabled={!selectedBaby.device.lullaby_playing}
                            />
                          </div>
                        </div>
                      )}
                      {!selectedBaby.parent_settings.allow_lullaby_control && (
                        <p className="mt-2 text-sm text-gray-500">
                          Lullaby control is not allowed by parent
                        </p>
                      )}
                    </div>
                  </Card>

                  {/* Projector Control */}
                  <Card className="lg:col-span-2">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center text-lg font-medium">
                          <SparklesIcon className="mr-2 h-5 w-5" />
                          Projector Control
                        </h3>
                        <Switch
                          checked={selectedBaby.device.projector_on}
                          onCheckedChange={(checked) =>
                            handleProjectorControl(
                              selectedBaby.device.id,
                              checked ? 'on' : 'off',
                              checked ? selectedBaby.device.projector_brightness : undefined,
                            )
                          }
                          disabled={!selectedBaby.parent_settings.allow_projector_control}
                        />
                      </div>
                      {selectedBaby.parent_settings.allow_projector_control && (
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Brightness</span>
                            <span className="text-sm font-medium">
                              {selectedBaby.device.projector_brightness}%
                            </span>
                          </div>
                          <Slider
                            value={[selectedBaby.device.projector_brightness]}
                            min={10}
                            max={selectedBaby.parent_settings.max_brightness}
                            step={5}
                            onValueChange={(values: number[]) =>
                              handleProjectorControl(
                                selectedBaby.device.id,
                                'on',
                                values[0],
                              )
                            }
                            disabled={!selectedBaby.device.projector_on}
                          />
                        </div>
                      )}
                      {!selectedBaby.parent_settings.allow_projector_control && (
                        <p className="mt-2 text-sm text-gray-500">
                          Projector control is not allowed by parent
                        </p>
                      )}
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