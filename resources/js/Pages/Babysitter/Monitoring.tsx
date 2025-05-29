import { useEffect, useState } from 'react';
import BabysitterLayout from '@/Layouts/BabysitterLayout';
import { Head } from '@inertiajs/react';
import axios from '@/lib/axios';
import { Card } from '@/Components/ui/card';
import { toast } from '@/Components/ui/use-toast';
import {
  VideoCameraIcon,
  ChartBarIcon,
  BellIcon,
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
  camera_url: string;
  sensors: {
    temperature: number;
    humidity: number;
    noise_level: number;
    motion_detected: boolean;
  };
  status: {
    sleeping: boolean;
    crying: boolean;
    active: boolean;
  };
}

export default function Monitoring({ auth }: Props) {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBabyData = async () => {
    try {
      const response = await axios.get('/api/babysitter/monitoring');
      setBabies(response.data.assigned_babies);
      if (response.data.assigned_babies.length > 0 && !selectedBaby) {
        setSelectedBaby(response.data.assigned_babies[0]);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch baby data');
      toast({
        title: 'Error',
        description: 'Failed to fetch monitoring data. Please try again.',
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

  return (
    <BabysitterLayout user={auth.user}>
      <Head title="Live Monitoring" />

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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Live Camera Feed */}
                  <Card className="lg:col-span-2">
                    <div className="p-6">
                      <h3 className="flex items-center text-lg font-medium">
                        <VideoCameraIcon className="mr-2 h-5 w-5" />
                        Live Camera Feed
                      </h3>
                      <div className="mt-4 aspect-video rounded-lg bg-gray-100">
                        {/* Camera feed component will be implemented here */}
                        <div className="flex h-full items-center justify-center">
                          <img
                            src={selectedBaby.camera_url}
                            alt="Live camera feed"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Sensor Data */}
                  <Card>
                    <div className="p-6">
                      <h3 className="mb-4 flex items-center text-lg font-medium">
                        <ChartBarIcon className="mr-2 h-5 w-5" />
                        Sensor Data
                      </h3>
                      <div className="space-y-4">
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
                        <div className="rounded-lg bg-gray-50 p-4">
                          <div className="text-sm text-gray-500">Noise Level</div>
                          <div className="text-2xl font-semibold">
                            {selectedBaby.sensors.noise_level} dB
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4">
                          <div className="text-sm text-gray-500">Motion</div>
                          <div className="text-2xl font-semibold">
                            {selectedBaby.sensors.motion_detected ? 'Detected' : 'None'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Baby Status */}
                  <Card className="lg:col-span-3">
                    <div className="p-6">
                      <h3 className="mb-4 flex items-center text-lg font-medium">
                        <BellIcon className="mr-2 h-5 w-5" />
                        Current Status
                      </h3>
                      <div className="flex space-x-4">
                        <div
                          className={`flex-1 rounded-lg p-4 ${
                            selectedBaby.status.sleeping
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <div className="font-medium">Sleeping</div>
                          <div className="text-sm">
                            {selectedBaby.status.sleeping ? 'Yes' : 'No'}
                          </div>
                        </div>
                        <div
                          className={`flex-1 rounded-lg p-4 ${
                            selectedBaby.status.crying
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <div className="font-medium">Crying</div>
                          <div className="text-sm">
                            {selectedBaby.status.crying ? 'Yes' : 'No'}
                          </div>
                        </div>
                        <div
                          className={`flex-1 rounded-lg p-4 ${
                            selectedBaby.status.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <div className="font-medium">Active</div>
                          <div className="text-sm">
                            {selectedBaby.status.active ? 'Yes' : 'No'}
                          </div>
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