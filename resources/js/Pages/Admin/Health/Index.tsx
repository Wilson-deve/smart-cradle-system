import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';

interface HealthData {
    systemStatus: string;
    lastCheck: string;
    metrics: {
        cpu: string;
        memory: string;
        storage: string;
        network: string;
    };
}

interface Props extends PageProps {
    healthData: HealthData;
}

export default function Index({ auth, healthData }: Props) {
    // If no auth data, show loading state
    if (!auth?.user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <AdminLayout user={auth.user}>
            <Head title="System Health" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">System Health</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4">System Status</h3>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${
                                            healthData.systemStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className="capitalize">{healthData.systemStatus}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Last checked: {healthData.lastCheck}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4">System Metrics</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>CPU Usage</span>
                                                <span>{healthData.metrics.cpu}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{
                                                    width: healthData.metrics.cpu
                                                }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>Memory Usage</span>
                                                <span>{healthData.metrics.memory}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{
                                                    width: healthData.metrics.memory
                                                }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>Storage Usage</span>
                                                <span>{healthData.metrics.storage}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-500 h-2 rounded-full" style={{
                                                    width: healthData.metrics.storage
                                                }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>Network Status</span>
                                                <span className="capitalize">{healthData.metrics.network}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
