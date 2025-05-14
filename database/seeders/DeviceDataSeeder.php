<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\SensorReading;
use App\Models\MaintenanceRecord;
use App\Models\DeviceLog;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DeviceDataSeeder extends Seeder
{
    public function run()
    {
        $devices = Device::all();

        foreach ($devices as $device) {
            // Update device with health metrics
            $device->update([
                'battery_level' => rand(60, 100),
                'signal_strength' => rand(70, 100),
                'last_maintenance_at' => Carbon::now()->subDays(rand(1, 30)),
                'next_maintenance_at' => Carbon::now()->addDays(rand(1, 30)),
                'sensor_readings' => [
                    'temperature' => rand(20, 25),
                    'humidity' => rand(40, 60),
                    'noise_level' => rand(0, 100),
                    'light_level' => rand(0, 100),
                    'movement_detected' => (bool)rand(0, 1),
                    'wetness_detected' => (bool)rand(0, 1),
                ],
                'maintenance_history' => [
                    [
                        'date' => Carbon::now()->subDays(30)->toDateTimeString(),
                        'type' => 'routine',
                        'description' => 'Regular maintenance check',
                    ],
                    [
                        'date' => Carbon::now()->subDays(60)->toDateTimeString(),
                        'type' => 'repair',
                        'description' => 'Sensor calibration',
                    ],
                ],
                'usage_statistics' => [
                    'swing_time' => rand(0, 120),
                    'music_playtime' => rand(0, 180),
                    'projector_usage' => rand(0, 60),
                ],
            ]);

            // Create sensor readings
            for ($i = 0; $i < 24; $i++) {
                SensorReading::create([
                    'device_id' => $device->id,
                    'temperature' => rand(20, 25),
                    'humidity' => rand(40, 60),
                    'noise_level' => rand(0, 100),
                    'light_level' => rand(0, 100),
                    'movement_detected' => (bool)rand(0, 1),
                    'wetness_detected' => (bool)rand(0, 1),
                    'created_at' => Carbon::now()->subHours($i),
                ]);
            }

            // Create maintenance records
            MaintenanceRecord::create([
                'device_id' => $device->id,
                'type' => 'routine',
                'description' => 'Regular maintenance check',
                'performed_at' => Carbon::now()->subDays(30),
                'next_due_at' => Carbon::now()->addDays(30),
            ]);

            // Create device logs
            $actions = ['swing_control', 'music_control', 'projector_control'];
            foreach ($actions as $action) {
                for ($i = 0; $i < 5; $i++) {
                    DeviceLog::create([
                        'device_id' => $device->id,
                        'action' => $action,
                        'duration' => rand(10, 60),
                        'created_at' => Carbon::now()->subHours(rand(1, 24)),
                    ]);
                }
            }
        }
    }
} 