<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\SystemLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class SystemLogSeeder extends Seeder
{
    public function run(): void
    {
        // Get some users and devices to associate with logs
        $users = User::all();
        $devices = Device::all();

        // Create different types of logs
        $logTypes = ['error', 'warning', 'info', 'debug'];
        $actions = [
            'User login attempt',
            'Device status changed',
            'Settings updated',
            'System maintenance',
            'Security alert',
            'Device connected',
            'Device disconnected',
            'Cradle motion detected',
            'Temperature alert',
            'Camera feed started'
        ];

        // Create 50 sample logs
        for ($i = 0; $i < 50; $i++) {
            SystemLog::create([
                'log_type' => $logTypes[array_rand($logTypes)],
                'action' => $actions[array_rand($actions)],
                'user_id' => $users->isNotEmpty() ? $users->random()->id : null,
                'device_id' => $devices->isNotEmpty() ? $devices->random()->id : null,
                'data' => [
                    'ip_address' => '192.168.' . rand(1, 255) . '.' . rand(1, 255),
                    'browser' => 'Chrome',
                    'details' => 'Sample log details for testing purposes',
                    'timestamp' => now()->subMinutes(rand(1, 1440))->toIso8601String()
                ],
                'created_at' => now()->subMinutes(rand(1, 1440)),
                'updated_at' => now()->subMinutes(rand(1, 1440))
            ]);
        }
    }
} 