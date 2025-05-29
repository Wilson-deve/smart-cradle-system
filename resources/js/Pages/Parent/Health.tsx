import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { PageProps } from '@/types';
import axios from 'axios';
import {
  ChartBarIcon,
  ClockIcon,
  SpeakerWaveIcon,
  CloudIcon,
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
}

interface CryAnalysis {
  total_cries: number;
  average_duration: number;
  cry_patterns: {
    time: string;
    duration: number;
    intensity: number;
  }[];
}

interface SleepData {
  total_sleep: number;
  deep_sleep: number;
  light_sleep: number;
  sleep_cycles: {
    start_time: string;
    end_time: string;
    duration: number;
    quality: 'deep' | 'light';
  }[];
}

interface EnvironmentalData {
  temperature_trends: {
    time: string;
    value: number;
  }[];
  humidity_trends: {
    time: string;
    value: number;
  }[];
}

interface HealthProps extends PageProps {
  auth: {
    user: User;
  };
  devices: Device[];
}

export default function Health({ auth, devices }: HealthProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [cryAnalysis, setCryAnalysis] = useState<CryAnalysis | null>(null);
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'cry' | 'sleep' | 'environment'>('cry');

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDevice(devices[0]);
    }
  }, [devices]);

  useEffect(() => {
    if (selectedDevice) {
      fetchHealthData();
    }
  }, [selectedDevice]);

  const fetchHealthData = async () => {
    if (!selectedDevice) return;

    setIsLoading(true);
    try {
      const response = await axios.get(route('parent.health.analytics', selectedDevice.id));
      setCryAnalysis(response.data.cry_analysis);
      setSleepData(response.data.sleep_data);
      setEnvironmentalData(response.data.environmental_data);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <ParentLayout user={auth.user}>
      <Head title="Health Reports" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
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

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('cry')}
                className={`${
                  activeTab === 'cry'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                <SpeakerWaveIcon className="mr-2 h-5 w-5" />
                Cry Analysis
              </button>
              <button
                onClick={() => setActiveTab('sleep')}
                className={`${
                  activeTab === 'sleep'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                <ClockIcon className="mr-2 h-5 w-5" />
                Sleep Tracking
              </button>
              <button
                onClick={() => setActiveTab('environment')}
                className={`${
                  activeTab === 'environment'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                <CloudIcon className="mr-2 h-5 w-5" />
                Environmental Trends
              </button>
            </nav>
          </div>

          {/* Content */}
          {selectedDevice ? (
            <div className="bg-white shadow sm:rounded-lg">
              {activeTab === 'cry' && cryAnalysis && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Cry Analysis</h3>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Total Cries Today</h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {cryAnalysis.total_cries}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Average Duration</h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {formatDuration(cryAnalysis.average_duration)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Cry Patterns</h4>
                    <div className="space-y-4">
                      {cryAnalysis.cry_patterns.map((pattern, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-900">
                              {new Date(pattern.time).toLocaleTimeString()}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDuration(pattern.duration)}
                            </span>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-indigo-500 rounded-full"
                              style={{ width: `${(pattern.intensity / 100) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sleep' && sleepData && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Sleep Tracking</h3>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Total Sleep</h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {formatDuration(sleepData.total_sleep)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Deep Sleep</h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {formatDuration(sleepData.deep_sleep)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Light Sleep</h4>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {formatDuration(sleepData.light_sleep)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Sleep Cycles</h4>
                    <div className="space-y-4">
                      {sleepData.sleep_cycles.map((cycle, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-900">
                                {new Date(cycle.start_time).toLocaleTimeString()}
                              </span>
                              <span className="text-gray-500 mx-2">to</span>
                              <span className="text-sm text-gray-900">
                                {new Date(cycle.end_time).toLocaleTimeString()}
                              </span>
                            </div>
                            <span className={`text-sm font-medium ${
                              cycle.quality === 'deep' ? 'text-indigo-600' : 'text-blue-600'
                            }`}>
                              {cycle.quality.charAt(0).toUpperCase() + cycle.quality.slice(1)} Sleep
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Duration: {formatDuration(cycle.duration)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'environment' && environmentalData && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Environmental Trends</h3>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Temperature Trends</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {/* Temperature chart would go here */}
                        <div className="space-y-2">
                          {environmentalData.temperature_trends.map((point, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {new Date(point.time).toLocaleTimeString()}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {point.value}°C
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Humidity Trends</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {/* Humidity chart would go here */}
                        <div className="space-y-2">
                          {environmentalData.humidity_trends.map((point, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {new Date(point.time).toLocaleTimeString()}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {point.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Device Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a device to view health analytics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
}
